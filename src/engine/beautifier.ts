import beautify from 'js-beautify';

export function formatJavaScript(
  source: string,
  options: {
    indentSize?: number;
    unescapeStrings?: boolean;
    spaceBeforeConditional?: boolean;
  } = {}
): string {
  try {
    return beautify.js(source, {
      indent_size: options.indentSize || 2,
      indent_char: ' ',
      max_preserve_newlines: 2,
      preserve_newlines: true,
      keep_array_indentation: false,
      break_chained_methods: false,
      brace_style: 'collapse',
      space_before_conditional: options.spaceBeforeConditional !== false,
      unescape_strings: options.unescapeStrings !== false,
      jslint_happy: true,
      end_with_newline: true,
      wrap_line_length: 0,
      comma_first: false,
      e4x: true,
    });
  } catch {
    return source;
  }
}
