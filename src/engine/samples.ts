import type { PackerType } from './types';

export interface CodeSample {
  id: string;
  name: string;
  packer: PackerType;
  badge: string;
  code: string;
}

export const CODE_SAMPLES: CodeSample[] = [
  {
    id: 'packer-demo',
    name: 'Dean Edwards Packer',
    packer: 'p_a_c_k_e_r',
    badge: 'Packer',
    code: `eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c]);return p}('0 3=1;2.4(\"5 6!\");',7,7,'var|100|console|result|log|Hello|World'.split('|'),0,{}))`,
  },
  {
    id: 'obfuscatorio-demo',
    name: 'Obfuscator.IO Hex & Shift',
    packer: 'obfuscatorio',
    badge: 'Obfuscator.IO',
    code: `var _0x5a1e = ['log', 'Hello\\x20from\\x20Oathan\\x20Rex\\x20Studio!', 'warn'];
(function (_0x2d8f05, _0x4b81bb) {
  var _0x4d74cb = function (_0x3a4f82) {
    while (--_0x3a4f82) {
      _0x2d8f05['push'](_0x2d8f05['shift']());
    }
  };
  _0x4d74cb(++_0x4b81bb);
}(_0x5a1e, 0x1a4));
var _0x3e1f = function (_0x2d8f05, _0x4b81bb) {
  _0x2d8f05 = _0x2d8f05 - 0x0;
  var _0x4d74cb = _0x5a1e[_0x2d8f05];
  return _0x4d74cb;
};
console[_0x3e1f('0x0')](_0x3e1f('0x1'));`,
  },
  {
    id: 'jsfuck-demo',
    name: 'JSFuck 6-Character',
    packer: 'jsfuck',
    badge: 'JSFuck',
    code: `[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]][([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]((![]+[])[+!+[]]+(![]+[])[!+[]+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]+(!![]+[])[+[]]+('alert("Decoded from JSFuck")'))()`,
  },
  {
    id: 'aaencode-demo',
    name: 'AAencode Japanese Smileys',
    packer: 'aaencode',
    badge: 'AAencode',
    code: `(ﾟДﾟ) ['_'] ( (ﾟДﾟ) ['_'] ('alert("Hello from AAencode!");') (ﾟΘﾟ)) ('_');`,
  },
  {
    id: 'urlencode-demo',
    name: 'URL-Encoded Bookmarklet',
    packer: 'urlencode',
    badge: 'URLencode',
    code: `javascript%3A%28function%28%29%7Bconsole.log%28%22Unpacked%20Bookmarklet%22%29%3Balert%28%22Active%20Script%22%29%3B%7D%29%28%29%3B`,
  },
  {
    id: 'array-demo',
    name: 'Array Index Obfuscation',
    packer: 'arrayencode',
    badge: 'Array',
    code: `var _items = ['log', 'PerspectiveFix', 'https://perspectivefix.app', 'info'];
console[_items[0]](_items[1] + ' running at ' + _items[2]);`,
  },
];
