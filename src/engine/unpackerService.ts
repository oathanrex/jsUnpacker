import type { PackerType, UnpackerOptions, UnpackResult } from './types';
import { detectPacker } from './detect';
import { PackerUnpacker } from './unpackers/packer';
import { JavascriptObfuscator } from './unpackers/javascriptobfuscator';
import { ObfuscatorIO } from './unpackers/obfuscatorio';
import { ArrayDecode } from './unpackers/arraydecode';
import { NumberDecode } from './unpackers/numberdecode';
import { JSFuckDecode } from './unpackers/jsfuck';
import { AADecode } from './unpackers/aaencode';
import { JJDecode } from './unpackers/jjencode';
import { Urlencoded } from './unpackers/urlencode';
import { MyObfuscate } from './unpackers/myobfuscate';
import { EvalDecode } from './unpackers/evaldecode';
import { WiseDecode } from './unpackers/wise';
import { CleanSource } from './unpackers/cleansource';
import { formatJavaScript } from './beautifier';

export function executeUnpack(
  source: string,
  packer: PackerType,
  options: UnpackerOptions
): UnpackResult {
  const startTime = performance.now();
  const inputSize = new Blob([source]).size;

  let cleanInput = source.trim();
  // Strip comments unless explicitly part of code
  cleanInput = cleanInput.replace(/\/\*(?!\s*@de4js)[\s\S]*?\*\/|^[\s\t]*\/\/.*/gm, '');

  if (!cleanInput) {
    return {
      success: true,
      output: '',
      detectedType: 'none',
      durationMs: 0,
      inputSize: 0,
      outputSize: 0,
      reductionRatio: 0,
    };
  }

  let activeType = packer;
  if (activeType === 'auto') {
    activeType = detectPacker(cleanInput);
  }

  let unpacked = cleanInput;
  let errorMsg: string | undefined;

  try {
    switch (activeType) {
      case 'p_a_c_k_e_r':
        unpacked = PackerUnpacker.unpack(unpacked);
        break;

      case 'obfuscatorio':
        unpacked = ObfuscatorIO(unpacked, options);
        break;

      case 'javascriptobfuscator':
        unpacked = JavascriptObfuscator.unpack(unpacked);
        break;

      case 'arrayencode':
        unpacked = ArrayDecode(unpacked, options);
        break;

      case 'numberencode':
        unpacked = NumberDecode(unpacked);
        break;

      case 'jsfuck':
        unpacked = JSFuckDecode(unpacked);
        break;

      case 'aaencode':
        unpacked = AADecode.decode(unpacked);
        break;

      case 'jjencode':
        unpacked = JJDecode.decode(unpacked);
        break;

      case 'urlencode':
        unpacked = Urlencoded.unpack(unpacked);
        break;

      case 'myobfuscate':
        unpacked = MyObfuscate.unpack(unpacked);
        break;

      case 'evalencode':
        unpacked = EvalDecode(unpacked);
        break;

      case 'wise':
        unpacked = WiseDecode(unpacked);
        break;

      case 'cleansource':
      default:
        unpacked = CleanSource(unpacked, options);
        break;
    }

    // Always pass through CleanSource for AST option normalization
    unpacked = CleanSource(unpacked, options);

    // Format output with js-beautify if option enabled
    if (options.formatCode) {
      unpacked = formatJavaScript(unpacked, {
        unescapeStrings: options._unescape,
      });
    }
  } catch (err: any) {
    errorMsg = err?.message || String(err);
    // If specific unpacker fails, fallback to cleanSource + formatting
    try {
      unpacked = CleanSource(cleanInput, options);
      if (options.formatCode) {
        unpacked = formatJavaScript(unpacked);
      }
    } catch {
      unpacked = cleanInput;
    }
  }

  const endTime = performance.now();
  const outputSize = new Blob([unpacked]).size;
  const reductionRatio =
    inputSize > 0 ? Math.round(((inputSize - outputSize) / inputSize) * 100) : 0;

  return {
    success: !errorMsg,
    output: unpacked,
    detectedType: activeType,
    error: errorMsg,
    durationMs: Math.round(endTime - startTime),
    inputSize,
    outputSize,
    reductionRatio,
  };
}
