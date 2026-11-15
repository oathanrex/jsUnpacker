export const MyObfuscate = {
  detect(str: string): boolean {
    return /^var _escape = '%[a-f0-9]{2}/i.test(str.trim());
  },

  unpack(str: string): string {
    if (MyObfuscate.detect(str)) {
      try {
        const matches = /'([^']*)'/.exec(str);
        if (matches && matches[1]) {
          let unescaped = decodeURIComponent(matches[1]);
          if (unescaped.startsWith('<script>')) {
            unescaped = unescaped.substring(8);
          }
          if (unescaped.endsWith('</script>')) {
            unescaped = unescaped.substring(0, unescaped.length - 9);
          }
          return unescaped;
        }
      } catch {
        // Fallback
      }
    }
    return str;
  },
};
