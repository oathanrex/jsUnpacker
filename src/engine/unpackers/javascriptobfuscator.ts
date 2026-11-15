export const JavascriptObfuscator = {
  detect(str: string): boolean {
    return /^var _0x[a-f0-9]+ ?\= ?\[/i.test(str.trim());
  },

  unpack(str: string): string {
    if (JavascriptObfuscator.detect(str)) {
      const matches = /var (_0x[a-f\d]+) ?\= ?\[(.*?)\];/i.exec(str);
      if (matches) {
        const varName = matches[1];
        const strings = JavascriptObfuscator._smart_split(matches[2]);
        str = str.substring(matches[0].length);
        for (let k = 0; k < strings.length; k++) {
          str = str.replace(
            new RegExp(varName + '\\[' + k + '\\]', 'g'),
            JavascriptObfuscator._fix_quotes(JavascriptObfuscator._unescape(strings[k]))
          );
        }
      }
    }
    return str;
  },

  _fix_quotes(str: string): string {
    const matches = /^"(.*)"$/.exec(str);
    if (matches) {
      str = matches[1];
      str = "'" + str.replace(/'/g, "\\'") + "'";
    }
    return str;
  },

  _smart_split(str: string): string[] {
    const strings: string[] = [];
    let pos = 0;
    while (pos < str.length) {
      if (str.charAt(pos) === '"') {
        let word = '';
        pos += 1;
        while (pos < str.length) {
          if (str.charAt(pos) === '"') {
            break;
          }
          if (str.charAt(pos) === '\\') {
            word += '\\';
            pos++;
          }
          word += str.charAt(pos);
          pos++;
        }
        strings.push('"' + word + '"');
      }
      pos += 1;
    }
    return strings;
  },

  _unescape(str: string): string {
    for (let i = 32; i < 128; i++) {
      str = str.replace(new RegExp('\\\\x' + i.toString(16), 'ig'), String.fromCharCode(i));
    }
    str = str.replace(/\\x09/g, '\t');
    return str;
  },
};
