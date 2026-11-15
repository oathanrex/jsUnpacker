import { utils } from '../utils';
import type { UnpackerOptions } from '../types';

export function ArrayDecode(source: string, options: Partial<UnpackerOptions> = {}): string {
  const detectPattern = /^(var|const|let)\s+((?![^_a-zA-Z$])[\w$]*)\s*=\s*\[.*?\];/;
  const match = source.match(detectPattern);

  if (!match || match.length !== 3) throw new Error('Not matched array pattern');

  const varName = match[2];
  const keyPattern = new RegExp(varName.replace(/\$/g, '\\$') + '\\[(\\d+)\\]', 'g');
  let code = source.replace(detectPattern, '');

  let rawArray = match[0].replace(/[\s\S]*?\[/, '[');
  let arrayValues: any[];
  try {
    arrayValues = new Function('return ' + rawArray)();
  } catch {
    throw new Error('Failed to evaluate array literal in ArrayDecode');
  }

  const pieces = code.split(';').map((piece) =>
    piece.replace(keyPattern, (_key, indexStr) => {
      const index = parseInt(indexStr, 10);
      const item = arrayValues[index];
      if (item === undefined) return _key;
      const q = utils.strWrap(String(item));
      return q + utils.escapeRegExp(String(item), q) + q;
    })
  );

  code = pieces.join(';');

  if (options.methodChain) code = utils.methodChain(code);

  return code;
}
