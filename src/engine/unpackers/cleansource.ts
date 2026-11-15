import { utils } from '../utils';
import type { UnpackerOptions } from '../types';

export function CleanSource(
  source: string,
  options: Partial<UnpackerOptions> = {}
): string {
  let code = source;

  const pieces = code.split(';').map((piece) => {
    if (options.calc) piece = utils.calcHex(piece);
    if (options._unescape) piece = utils._unescape(piece);
    piece = utils.toBool(piece);
    piece = utils.propArr(piece);
    return piece;
  });

  code = pieces.join(';');

  if (options.strMerge) code = utils.strMerge(code);
  if (options.calc) code = utils.calcNumber(code);
  if (options.methodChain) code = utils.methodChain(code);
  if (options.removeGrouping) code = utils.removeGrouping(code);

  return code;
}
