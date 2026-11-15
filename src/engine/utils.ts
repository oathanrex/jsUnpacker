export const utils = {
  strWrap: (str: string): string => {
    if (str.includes('\n') || (str.includes('"') && str.includes("'"))) return '`';
    return !str.includes("'") ? "'" : '"';
  },

  escapeRegExp: (str: string, q: string): string => {
    return str
      .replace(new RegExp(`[\\\\${q}\\n]`, 'g'), '\\$&')
      .replace(/-/g, '\\x2d');
  },

  _unescape: (str: string): string => {
    for (let i = 32; i < 128; i++) {
      str = str.replace(
        new RegExp('\\\\x' + i.toString(16), 'ig'),
        String.fromCharCode(i)
      );
    }
    str = str.replace(/\\x09/g, '\t');
    return str;
  },

  strMerge: (str: string): string => {
    return str.replace(
      /(?<![[(=<>,!?:|&+\-*/])('|")\s*\+\s*\1(?!([\])=<>,?:|&!+\-*/]|$))/g,
      ''
    );
  },

  methodChain: (str: string): string => {
    str = str.replace(
      /(?<=(\b(return|throw|in|of|new|delete|default|function|async|await|get|set)|\{|\*))\s*\[('|")((?![^_a-zA-Z$])[\w$]*)\3\]\s*\(/g,
      ' $4( '
    );
    str = str.replace(
      /(?<=((?![^_a-zA-Z$])[\w$]*)|\]|\))\[('|")((?![^_a-zA-Z$])[\w$]*)\2\]/gi,
      ' .$3 '
    );
    return str;
  },

  calcHex: (str: string): string => {
    str = str.replace(
      /(?<!['"])(?<!\w)[+-]?\s*0x[a-f\d]+((?<!\w)0x[a-f\d]+|[+\-*/\s])*(?<!\w)0x[a-f\d]+(?!['"])/gi,
      (m) => {
        try {
          // safe evaluate simple hex arithmetic
          const evaluated = Function('"use strict"; return (' + m + ')')();
          return String(evaluated);
        } catch {
          return m;
        }
      }
    );
    str = str.replace(
      /(?<=[[(=<>,!?:|&+\-*/])\s*0x[a-f\d]+\s*(?=([\])=<>,?:|&+\-*/]|$))/gi,
      (m) => String(parseInt(m, 16))
    );
    return str;
  },

  calcNumber: (str: string): string => {
    return str.replace(/(?<!['"\w])[+-]?\s*\d[+\-*/\d.\s]*\d(?!['"\w])/g, (m) => {
      if (!/[+\-*/]/.test(m)) return m;
      try {
        const val = Function('"use strict"; return (' + m + ')')();
        return String(val);
      } catch {
        return m;
      }
    });
  },

  removeGrouping: (str: string): string => {
    str = str.replace(/(?<!\w[\s\n]*)(\()(\d+(\.\d+)?)(\))/g, '$2');
    str = str.replace(/(?<!\w[\s\n]*)(\()((['"])\w+(\3))(\))/g, '$2');
    return str;
  },

  toBool: (str: string): string => {
    return str.replace(
      /((?<=([=:(,|&[]|return|=>))|^)[\s\n]*!{1,2}(\[\]|0|1)[\s\n]*((?=[;,)}|&\]])|$)/g,
      (m) => {
        try {
          const val = Function('"use strict"; return (' + m + ')')();
          return ' ' + Boolean(val);
        } catch {
          return m;
        }
      }
    );
  },

  propArr: (str: string): string => {
    return str.replace(/\[\((['"])((?![^_a-zA-Z$])[\w$]*)['"]\)\]/gi, '[$1$2$1]');
  },
};
