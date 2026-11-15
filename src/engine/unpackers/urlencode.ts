export const Urlencoded = {
  detect(str: string): boolean {
    const trimmed = str.trim();
    if (trimmed.indexOf(' ') === -1) {
      if (trimmed.indexOf('%2') !== -1) return true;
      if (trimmed.replace(/[^%]+/g, '').length > 3) return true;
    }
    return false;
  },

  unpack(str: string): string {
    if (Urlencoded.detect(str)) {
      try {
        if (str.indexOf('%2B') !== -1 || str.indexOf('%2b') !== -1) {
          return decodeURIComponent(str.replace(/\+/g, '%20'));
        } else {
          return decodeURIComponent(str);
        }
      } catch {
        // Fallback to unescape
        return unescape(str);
      }
    }
    return str;
  },
};
