export const AADecode = {
  detect(text: string): boolean {
    const trimmed = text.trim();
    return (
      trimmed.indexOf('~┻━┻') !== -1 ||
      trimmed.indexOf("(\uFF9F\u0414\uFF9F) ['_']") !== -1 ||
      trimmed.indexOf("(\uFF9F\u0414\uFF9F)") !== -1
    );
  },

  decode(text: string): string {
    const evalPreamble = "(\uFF9F\u0414\uFF9F) ['_'] ( (\uFF9F\u0414\uFF9F) ['_'] (";
    const decodePreamble = "( (\uFF9F\u0414\uFF9F) ['_'] (";
    const evalPostamble = ") (\uFF9F\u0398\uFF9F)) ('_');";
    const decodePostamble = ") ());";

    let src = text.trim();
    if (!src) return '';

    if (src.lastIndexOf(evalPreamble) < 0) {
      // Try alternate match
      if (src.indexOf("(\uFF9F\u0414\uFF9F)") === -1) {
        throw new Error('Given code is not encoded as aaencode.');
      }
    }

    try {
      const decodingScript = src
        .replace(evalPreamble, decodePreamble)
        .replace(evalPostamble, decodePostamble);
      const runner = new Function('return ' + decodingScript);
      return String(runner());
    } catch (err: any) {
      throw new Error('AAdecode failed: ' + (err?.message || err));
    }
  },
};
