export function JSFuckDecode(source: string): string {
  const detectPattern = /\)[\s\n]*\(('.*?'|".*?")?\)[\s\n;]*$/;
  const anonPattern = /^[\s\n]*function\sanonymous\([\s\n]*\)\s*\{[\s\n]*/;

  let code = source.trim();

  try {
    if (detectPattern.test(code)) {
      code = code.replace(detectPattern, ')');
    }
    // Evaluate safely
    const fn = new Function('return (' + code + ').toString()');
    let resolved = String(fn());

    if (anonPattern.test(resolved)) {
      resolved = resolved.replace(anonPattern, '');
      resolved = resolved.replace(/[\s\n]*\}[\s\n]*$/, '');
    }

    return resolved;
  } catch (err: any) {
    throw new Error('JSFuck deobfuscation failed: ' + (err?.message || err));
  }
}
