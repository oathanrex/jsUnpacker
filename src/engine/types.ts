export type PackerType =
  | 'auto'
  | 'p_a_c_k_e_r'
  | 'obfuscatorio'
  | 'javascriptobfuscator'
  | 'arrayencode'
  | 'numberencode'
  | 'jsfuck'
  | 'aaencode'
  | 'jjencode'
  | 'urlencode'
  | 'myobfuscate'
  | 'evalencode'
  | 'wise'
  | 'cleansource';

export interface UnpackerOptions {
  formatCode: boolean;
  _unescape: boolean;
  methodChain: boolean;
  strMerge: boolean;
  calc: boolean;
  removeGrouping: boolean;
  lineNumbers: boolean;
}

export interface UnpackResult {
  success: boolean;
  output: string;
  detectedType: string;
  error?: string;
  durationMs: number;
  inputSize: number;
  outputSize: number;
  reductionRatio: number;
}

export interface PackerDefinition {
  id: PackerType;
  name: string;
  category: 'Popular' | 'Array & Obfuscation' | 'Esoteric & ASCII' | 'Compression & Eval';
  badge: string;
  description: string;
}

export const PACKER_DEFINITIONS: PackerDefinition[] = [
  {
    id: 'auto',
    name: 'Auto-Detect',
    category: 'Popular',
    badge: 'AI/Regex Heuristics',
    description: 'Automatically analyzes AST & regex patterns to apply the exact matching unpacker.',
  },
  {
    id: 'p_a_c_k_e_r',
    name: 'Dean Edwards P.A.C.K.E.R',
    category: 'Compression & Eval',
    badge: 'eval(function(p,a,c,k,e,r)...)',
    description: 'Classic Dean Edwards packer unpacker with dictionary radix replacement.',
  },
  {
    id: 'obfuscatorio',
    name: 'Obfuscator.IO (Hex & Array Rotation)',
    category: 'Array & Obfuscation',
    badge: 'Hex & Shift Arrays',
    description: 'Decrypts strings from obfuscator.io with IIFE array rotations and hex offset calls.',
  },
  {
    id: 'javascriptobfuscator',
    name: 'JavaScript Obfuscator',
    category: 'Array & Obfuscation',
    badge: 'var _0x... = [...]',
    description: 'Unpacks javascriptobfuscator.com array index lookups and unescapes string constants.',
  },
  {
    id: 'arrayencode',
    name: 'Array Decoder',
    category: 'Array & Obfuscation',
    badge: 'String Array Indexing',
    description: 'Decodes generic array variable mapping and inlines string items by key index.',
  },
  {
    id: 'numberencode',
    name: '_Number Obfuscator',
    category: 'Array & Obfuscation',
    badge: 'var _0123;',
    description: 'Decodes numerical variable obfuscation sequences into readable source code.',
  },
  {
    id: 'jsfuck',
    name: 'JSFuck',
    category: 'Esoteric & ASCII',
    badge: '[][(![]+[])[+[]]...]',
    description: 'Deobfuscates 6-character esoteric JavaScript ([ ] ( ) ! +) back into clean JS.',
  },
  {
    id: 'aaencode',
    name: 'AAencode',
    category: 'Esoteric & ASCII',
    badge: '(ﾟДﾟ) [\'_\']',
    description: 'Japanese emoji-style smiley character obfuscation decoder.',
  },
  {
    id: 'jjencode',
    name: 'JJencode',
    category: 'Esoteric & ASCII',
    badge: '$=~[];$={...}',
    description: 'Variable emoticon and character-table substitution encoder decoder.',
  },
  {
    id: 'urlencode',
    name: 'URLencode / Bookmarklet',
    category: 'Popular',
    badge: '%20%28function%29...',
    description: 'Unpacks percent-encoded scripts, bookmarklets, and URL escape sequences.',
  },
  {
    id: 'myobfuscate',
    name: 'MyObfuscate',
    category: 'Compression & Eval',
    badge: 'var _escape = ...',
    description: 'Unpacks MyObfuscate wrappers and eliminates tracking callbacks.',
  },
  {
    id: 'evalencode',
    name: 'Eval Unwrap',
    category: 'Compression & Eval',
    badge: 'eval(...) Sandbox',
    description: 'Safely traps eval-wrapped execution and extracts the uncompressed inner code.',
  },
  {
    id: 'wise',
    name: 'WiseLoop Obfuscator',
    category: 'Compression & Eval',
    badge: 'WiseLoop PHP-JS',
    description: 'Unpacks WiseLoop PHP-JavaScript obfuscator evaluation wrappers.',
  },
  {
    id: 'cleansource',
    name: 'Clean Source & De-minify',
    category: 'Popular',
    badge: 'AST Normalize',
    description: 'Unescapes hex/unicode, folds numeric expressions, merges strings, and normalizes object notation.',
  },
];
