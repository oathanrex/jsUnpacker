// @ts-ignore
import './jjdecode_core.js';

declare const JJdecode: {
  dst: string;
  out: (c: string) => void;
  decode: (txt: string) => string;
};

export const JJDecode = {
  detect(str: string): boolean {
    return str.indexOf('$={___:++$,$$$$:(![]+"")[$]') !== -1 || /^\$=~\[\];\$=\{/.test(str.trim());
  },

  decode(str: string): string {
    if (typeof JJdecode !== 'undefined') {
      JJdecode.dst = '';
      return JJdecode.decode(str);
    }
    throw new Error('JJdecode runtime not initialized');
  },
};
