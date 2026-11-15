import type { PackerType } from './types';
import { PackerUnpacker } from './unpackers/packer';
import { JavascriptObfuscator } from './unpackers/javascriptobfuscator';
import { Urlencoded } from './unpackers/urlencode';
import { MyObfuscate } from './unpackers/myobfuscate';
import { JJDecode } from './unpackers/jjencode';
import { AADecode } from './unpackers/aaencode';

export function detectPacker(source: string): PackerType {
  const trimmed = source.trim();
  if (!trimmed) return 'cleansource';

  // 1. _Number Obfuscator
  if (/^var\s_\d{4};[\s\n]*var\s_\d{4}\s?=/m.test(trimmed)) {
    return 'numberencode';
  }

  // 2. AAencode
  if (AADecode.detect(trimmed)) {
    return 'aaencode';
  }

  // 3. JJencode
  if (JJDecode.detect(trimmed)) {
    return 'jjencode';
  }

  // 4. JSFuck (starts with [][(![] or consists solely of 6 JSFuck characters)
  if (
    trimmed.startsWith('[][(![]') ||
    (trimmed.length > 10 && trimmed.replace(/[[\]()!+\s\n]/gm, '').trim() === '')
  ) {
    return 'jsfuck';
  }

  // 5. URLencode / Bookmarklet
  if (Urlencoded.detect(trimmed)) {
    return 'urlencode';
  }

  // 6. MyObfuscate
  if (MyObfuscate.detect(trimmed)) {
    return 'myobfuscate';
  }

  // 7. Obfuscator.IO (hex offset calls, array rotations)
  if (
    /((?![^_a-zA-Z$])[\w$]*)\(-?('|")(0x[a-f\d]+|\\x30\\x78[\\xa-f\d]+)\2(\s*,\s*('|").+?\5)?\)/i.test(
      trimmed
    )
  ) {
    return 'obfuscatorio';
  }

  // 8. Javascript Obfuscator (_0x array)
  if (JavascriptObfuscator.detect(trimmed)) {
    return 'javascriptobfuscator';
  }

  // 9. Generic Array Obfuscator
  if (/^(var|const|let)\s+((?![^_a-zA-Z$])[\w$]*)\s*=\s*\[.*?\];/m.test(trimmed)) {
    return 'arrayencode';
  }

  // 10. WiseLoop
  if (
    trimmed.startsWith('//Protected by WiseLoop PHP JavaScript Obfuscator') ||
    trimmed.includes(';eval(function(w,i,s,e)')
  ) {
    return 'wise';
  }

  // 11. Dean Edwards Packer
  if (PackerUnpacker.detect(trimmed)) {
    return 'p_a_c_k_e_r';
  }

  // 12. Generic Eval
  if (trimmed.indexOf('eval(') !== -1) {
    if (!/\b(window|document|console)\.\b/i.test(trimmed)) {
      return 'evalencode';
    }
  }

  return 'cleansource';
}
