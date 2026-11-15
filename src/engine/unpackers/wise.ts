export function WiseDecode(source: string): string {
  if (
    source.startsWith('//Protected by WiseLoop PHP JavaScript Obfuscator') ||
    source.includes(';eval(function(w,i,s,e)')
  ) {
    try {
      let result = '';
      const sandbox = new Function('eval', source);
      sandbox((code: string) => {
        result += code;
        return code;
      });
      if (result) return result;
    } catch {
      // fallback
    }
  }
  return source;
}
