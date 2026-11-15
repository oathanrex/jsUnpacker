import { test } from 'node:test';
import assert from 'node:assert';
import { executeUnpack } from './unpackerService.ts';
import { detectPacker } from './detect.ts';
import { CODE_SAMPLES } from './samples.ts';

const DEFAULT_OPTIONS = {
  formatCode: true,
  _unescape: true,
  methodChain: true,
  strMerge: true,
  calc: false,
  removeGrouping: false,
  lineNumbers: false,
};

test('detectPacker identifies Dean Edwards Packer correctly', () => {
  const sample = CODE_SAMPLES.find((s) => s.id === 'packer-demo');
  assert.ok(sample);
  const detected = detectPacker(sample.code);
  assert.equal(detected, 'p_a_c_k_e_r');
});

test('detectPacker identifies Obfuscator.IO correctly', () => {
  const sample = CODE_SAMPLES.find((s) => s.id === 'obfuscatorio-demo');
  assert.ok(sample);
  const detected = detectPacker(sample.code);
  assert.equal(detected, 'obfuscatorio');
});

test('detectPacker identifies JSFuck correctly', () => {
  const sample = CODE_SAMPLES.find((s) => s.id === 'jsfuck-demo');
  assert.ok(sample);
  const detected = detectPacker(sample.code);
  assert.equal(detected, 'jsfuck');
});

test('detectPacker identifies AAencode correctly', () => {
  const sample = CODE_SAMPLES.find((s) => s.id === 'aaencode-demo');
  assert.ok(sample);
  const detected = detectPacker(sample.code);
  assert.equal(detected, 'aaencode');
});

test('detectPacker identifies URLencode correctly', () => {
  const sample = CODE_SAMPLES.find((s) => s.id === 'urlencode-demo');
  assert.ok(sample);
  const detected = detectPacker(sample.code);
  assert.equal(detected, 'urlencode');
});

test('detectPacker identifies Array Obfuscator correctly', () => {
  const sample = CODE_SAMPLES.find((s) => s.id === 'array-demo');
  assert.ok(sample);
  const detected = detectPacker(sample.code);
  assert.equal(detected, 'arrayencode');
});

test('executeUnpack successfully deobfuscates Dean Edwards Packer', () => {
  const sample = CODE_SAMPLES.find((s) => s.id === 'packer-demo');
  assert.ok(sample);
  const result = executeUnpack(sample.code, 'auto', DEFAULT_OPTIONS);
  assert.equal(result.success, true);
  assert.ok(result.output.includes('console.log'));
  assert.ok(result.output.includes('Hello World'));
});

test('executeUnpack successfully deobfuscates Array Obfuscator', () => {
  const sample = CODE_SAMPLES.find((s) => s.id === 'array-demo');
  assert.ok(sample);
  const result = executeUnpack(sample.code, 'auto', DEFAULT_OPTIONS);
  assert.equal(result.success, true);
  assert.ok(result.output.includes('PerspectiveFix'));
});

test('executeUnpack successfully deobfuscates URLencode bookmarklet', () => {
  const sample = CODE_SAMPLES.find((s) => s.id === 'urlencode-demo');
  assert.ok(sample);
  const result = executeUnpack(sample.code, 'auto', DEFAULT_OPTIONS);
  assert.equal(result.success, true);
  assert.ok(result.output.includes('javascript:'));
  assert.ok(result.output.includes('Unpacked Bookmarklet'));
});
