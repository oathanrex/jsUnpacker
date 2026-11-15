# JSUnpacker Studio — Production JavaScript Deobfuscator & Unpacker

[![Status: Production](https://img.shields.io/badge/Status-Production-success?style=flat-square)](https://oathanrex.github.io/jsUnpacker/)
[![Live App](https://img.shields.io/badge/Live-oathanrex.github.io%2FjsUnpacker-blue?style=flat-square)](https://oathanrex.github.io/jsUnpacker/)
[![Privacy: 100% Client-Side](https://img.shields.io/badge/Privacy-100%25_Client--Side-emerald?style=flat-square)](https://oathanrex.github.io/jsUnpacker/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4_OKLCH-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**JSUnpacker Studio** is an open-source, high-performance client-side JavaScript deobfuscator and unpacker application engineered by **Oathan Rex** ([@oathanrex](https://github.com/oathanrex)), accessible live at **[oathanrex.github.io/jsUnpacker](https://oathanrex.github.io/jsUnpacker/)**.

Designed with the aesthetic precision and ergonomics of modern developer workstations (Chrome DevTools & Project IDX), JSUnpacker Studio decodes obfuscated, packed, and minified scripts directly inside your browser runtime with **zero external telemetry and zero server uploads**.

---

## ⚡ Supported Unpackers & Deobfuscation Engines

| Unpacker Engine | Detection Pattern | Target Obfuscation Family |
| :--- | :--- | :--- |
| **Dean Edwards P.A.C.K.E.R** | `eval(function(p,a,c,k,e,r)...)` | High-compression radix dictionary substitution used across web archives and scripts. |
| **Obfuscator.IO** | Hex offset calls & IIFE array rotation | Obfuscator.io hex string lookups, self-defending functions, and array shifts. |
| **JavaScript Obfuscator** | `var _0x... = [...]` | Standard array extraction, hex-encoded string decryption, and index normalization. |
| **Array Decoder** | Generic `var arr = [...]` | Inlines referenced array keys directly into call sites and simplifies method chains. |
| **_Number Obfuscator** | `var _0123; ...` | Numerical sequence variable encryption and scoped evaluation. |
| **JSFuck** | `[][(![]+[])[+[]]...]` | 6-character esoteric ASCII JavaScript deobfuscation into readable strings. |
| **AAencode** | `(ﾟДﾟ) ['_']` | Japanese anime smileys & emoticon Japanese character-table decoding. |
| **JJencode** | `$=~[];$={...}` | Variable emoticon and palindrome character substitution decoding. |
| **URLencode / Bookmarklet** | `%20%28function%29...` | Percent-encoded bookmarklets, escaped payload scripts, and URL parameters. |
| **MyObfuscate** | `var _escape = '%...'` | MyObfuscate packer unwrap and analytics callback neutralization. |
| **Eval Sandbox** | `eval(...)` | Safe client-side sandbox execution trapping without global window pollution. |
| **WiseLoop** | `//Protected by WiseLoop` | WiseLoop PHP-JavaScript evaluation wrapper unpacking. |
| **Clean Source AST** | Hex/Unicode literals | Unescapes `\x68\x65\x6c\x6c\x6f`, merges string concatenations, and recovers object paths. |

---

## 💎 Key Features

- **100% Client-Side Privacy**: All deobfuscation runs on device via browser Web Workers and native JavaScript execution. Your code is never transmitted over the network.
- **Realtime Heuristic Auto-Detection**: Instant regex and AST analysis to detect packer formats automatically with a single click (`Ctrl+Enter`).
- **Interactive Dual-Pane Workbench**: Monospace code editor with line numbers, side-by-side diff comparison, and byte-reduction telemetry.
- **Perceptually Uniform OKLCH Palette**: Shared design system with OLED true-dark (`#000000`) and paper-light themes matching the Oathan Rex developer ecosystem.
- **Preset Test Suite**: Instant 1-click samples for Dean Edwards Packer, Obfuscator.IO, JSFuck, AAencode, JJencode, and Array Obfuscation.
- **Flexible Ingestion**: Supports direct pasting, `.js` drag-and-drop file upload, and CORS-enabled remote script fetching.

---

## 🛠️ Architecture & Core Stack

```
Core Framework   : React 19 + TypeScript
Styling Engine   : Tailwind CSS v4 + Hardware-Accelerated OKLCH Design Tokens
Formatting       : JS-Beautify (Client-Side AST Normalization)
Icons            : Lucide React
Build Engine     : Vite 8 + Rollup Module Bundler
Deployment       : GitHub Actions CI/CD to GitHub Pages
```

---

## 👤 Author & Contact

**Oathan Rex**
- Portfolio: [https://oathanrex.github.io](https://oathanrex.github.io)
- GitHub: [@oathanrex](https://github.com/oathanrex)
- Project Inquiry: [oathanrex@gmail.com](mailto:oathanrex@gmail.com)
- Support: [buymeacoffee.com/oathanrex](https://buymeacoffee.com/oathanrex)

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
