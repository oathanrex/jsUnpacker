export function NumberDecode(source: string): string {
  const detectPattern = /_\d{4}\((_\d{4})\);\}/;
  let code = source.trim();

  if (!detectPattern.test(code)) throw new Error('Not matched _Number pattern');

  try {
    let result = '';
    code = code.replace(/var\s/g, 'this.');
    code = code.replace(/function\s(_\d{4})\(/, 'this.$1=function(');
    code = code.replace(detectPattern, 'resultScope.source=$1;};');

    const runner = new Function(
      'resultScope',
      '(function(){' + code + '}).call({});'
    );
    const scope: { source?: string } = {};
    runner(scope);

    if (scope.source) return scope.source;
  } catch (err: any) {
    throw new Error('NumberDecode failed: ' + (err?.message || err));
  }

  return source;
}
