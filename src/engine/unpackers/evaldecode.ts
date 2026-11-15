export function EvalDecode(source: string): string {
  try {
    let captured = '';
    const sandbox = new Function('eval', source);
    sandbox((code: string) => {
      captured = code;
      return code;
    });
    if (captured) return captured;
  } catch {
    // If Function sandbox fails, try regex matching inside eval(...)
    const match = source.match(/eval\s*\(\s*(['"`])([\s\S]*?)\1\s*\)/);
    if (match && match[2]) {
      return match[2];
    }
  }
  return source;
}
