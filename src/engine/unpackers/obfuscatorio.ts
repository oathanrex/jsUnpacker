import { utils } from '../utils';
import type { UnpackerOptions } from '../types';

export function ObfuscatorIO(
  source: string,
  options: Partial<UnpackerOptions> = {}
): string {
  const detectPattern =
    /((?![^_a-zA-Z$])[\w$]*)\(-?('|")(0x[a-f\d]+|\\x30\\x78[\\xa-f\d]+)\2(\s*,\s*('|").+?\5)?\)/gi;
  const initialMatch = source.match(detectPattern);

  if (!initialMatch) throw new Error('Not matched ObfuscatorIO pattern');

  let detectMatch: string[] = initialMatch.map((i) => i.replace(/\(.+?\)$/, ''));
  detectMatch = detectMatch.filter(
    (i, pos) => detectMatch.indexOf(i) === pos && i !== ''
  );

  if (detectMatch.length === 1) {
    const varIndex = source.search(funcDefinerPattern(detectMatch[0]));
    if (varIndex !== -1) {
      const { headVar, mainCode } = getHeadVar(varIndex, source);
      if (funcDefinerPattern(detectMatch[0]).test(headVar)) {
        return decode(
          {
            headCode: headVar,
            mainCode,
          },
          options,
          detectPattern
        );
      }
    }
  }

  return decode(splitMultiVar(detectMatch, source), options, detectPattern);
}

function decode(
  { headCode, mainCode }: { headCode: string; mainCode: string },
  options: Partial<UnpackerOptions>,
  detectPattern: RegExp
): string {
  headCode = headCode.replace(/\b(const|let)(\s*(?![^_a-zA-Z$])[\w$]*=)/gi, 'var $2');

  // Evaluate the head array & decryptor functions in isolated sandbox
  const sandbox = new Function('evalKey', `
    ${headCode};
    return function(callStr) {
      try {
        return eval(callStr);
      } catch(e) {
        return callStr;
      }
    };
  `);

  const decryptor = sandbox();

  const pieces = mainCode.split(';').map((piece) => {
    piece = piece.replace(detectPattern, (key) => {
      try {
        const item = decryptor(key);
        if (typeof item === 'string') {
          const q = utils.strWrap(item);
          return q + utils.escapeRegExp(item, q) + q;
        }
        return String(item);
      } catch {
        return key;
      }
    });

    if (options.calc) piece = utils.calcHex(piece);
    if (options._unescape) piece = utils._unescape(piece);
    piece = utils.toBool(piece);
    piece = utils.propArr(piece);

    return piece;
  });

  let result = pieces.join(';');

  if (options.strMerge) result = utils.strMerge(result);
  if (options.calc) result = utils.calcNumber(result);
  if (options.methodChain) result = utils.methodChain(result);

  return result;
}

function funcDefinerPattern(key: string, flags = 'i'): RegExp {
  return new RegExp(
    '\\b(var|const|let)\\s+' + key + '\\s*=\\s*function\\s*\\(.*?\\)\\s*',
    flags
  );
}

function splitMultiVar(detectMatch: string[], source: string) {
  let keyStore: Array<{ key: string; return: string; code: string }> = [];

  for (const key of detectMatch) {
    const { sourceVar, keyVar } = getVarDefiner(key, source);
    source = sourceVar;
    keyStore = keyStore.concat(keyVar);

    const { sourceFunc, keyFunc } = getFuncDefiner(key, source);
    source = sourceFunc;
    keyStore = keyStore.concat(keyFunc);
  }

  if (!keyStore.length) throw new Error('Key not found in ObfuscatorIO');

  let bodyVar = '';
  const headVarStore: Record<string, number> = {};
  for (const obj of keyStore) {
    bodyVar += obj.code;
    const returnIndex = source.search(funcDefinerPattern(obj.return));
    if (returnIndex !== -1) {
      headVarStore[obj.return] = returnIndex;
    }
  }

  const firstReturnKey = Object.keys(headVarStore)[0];
  if (!firstReturnKey) throw new Error('Could not find return definition');

  const { headVar, mainCode } = getHeadVar(headVarStore[firstReturnKey], source);

  return {
    headCode: headVar + bodyVar,
    mainCode,
  };
}

function getHeadVar(pos: number, source: string) {
  let bo = 0;
  let bc = 0;
  const sourceSize = source.length;
  let headVar = '';
  let mainCode = '';

  const splitSource = (p: number) => {
    headVar = source.slice(0, p);
    mainCode = source.slice(p);
  };

  while (pos < sourceSize) {
    if (source.charAt(pos) === '{') bo++;
    if (source.charAt(pos) === '}') bc++;
    if (bc === bo && bo !== 0) {
      splitSource(pos + 2);
      break;
    }
    pos++;
  }

  if (!mainCode) throw new Error('Failed to split source head variable');
  return { headVar, mainCode };
}

function getVarDefiner(key: string, source: string) {
  const varPattern =
    '\\b(var|const|let)\\s+' + key + '\\s*=\\s*((?!\\d)[a-z\\d_$]*?)(;|,)';
  const varGroupPattern = new RegExp(varPattern, 'gi');

  const keyVar: Array<{ key: string; return: string; code: string }> = [];
  let sourceVar = source;

  if (varGroupPattern.test(source)) {
    sourceVar = source.replace(varGroupPattern, (m) => {
      const varMatch = m.match(new RegExp(varPattern, 'i'));
      if (varMatch) {
        keyVar.push({
          key,
          return: varMatch[2],
          code: varMatch[0].replace(/,$/, ';'),
        });
        if (m.slice(-1) === ';') return '';
        return varMatch[1] + ' ';
      }
      return m;
    });
  }

  return { sourceVar, keyVar };
}

function getFuncDefiner(key: string, source: string) {
  const funcGroupPattern = funcDefinerPattern(key, 'gi');

  const keyFunc: Array<{ key: string; return: string; code: string }> = [];
  let sourceFunc = source;

  while (funcGroupPattern.test(source)) {
    const varIndex = source.search(funcDefinerPattern(key));
    const sourceSize = source.length;

    if (varIndex === -1) throw new Error('Not found function definer');

    let pos = varIndex;
    let bo = 0;
    let bc = 0;

    const splitSource = (p: number) => {
      sourceFunc = source.slice(0, varIndex) + source.slice(p);
      const varFunc = source.slice(varIndex, p);
      const returnMatch = varFunc.match(
        /(return\s+((?![^_a-zA-Z$])[\w$]*))(?![\s\S]*return)/i
      );
      if (returnMatch) {
        keyFunc.push({
          key,
          return: returnMatch[2],
          code: varFunc,
        });
      }
      source = sourceFunc;
    };

    while (pos < sourceSize) {
      if (source.charAt(pos) === '{') bo++;
      if (source.charAt(pos) === '}') bc++;
      if (bc === bo && bo !== 0) {
        splitSource(pos + 2);
        break;
      }
      pos++;
    }
  }

  return { sourceFunc, keyFunc };
}
