import React, { useState, useRef } from 'react';
import {
  BookOpen,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Lock,
  Layers,
  Search,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
} from 'lucide-react';

interface GuideSectionProps {
  onLoadSample?: (code: string, type: string) => void;
}

type TabId = 'guide' | 'signatures' | 'walkthrough' | 'safety' | 'nested' | 'faq';

interface GuideTabItem {
  id: TabId;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: GuideTabItem[] = [
  { id: 'guide', label: 'Field Guide', shortLabel: 'Field Guide', icon: BookOpen },
  { id: 'signatures', label: 'Recognizing Scrambled Code', shortLabel: 'Signatures', icon: Search },
  { id: 'walkthrough', label: '4-Step Walkthrough', shortLabel: 'Walkthrough', icon: Zap },
  { id: 'safety', label: 'Security Checklist', shortLabel: 'Security', icon: AlertTriangle },
  { id: 'nested', label: 'Nested Obfuscation', shortLabel: 'Nested Code', icon: Layers },
  { id: 'faq', label: 'FAQ', shortLabel: 'FAQ', icon: HelpCircle },
];

export const GuideSection: React.FC<GuideSectionProps> = () => {
  const [activeTab, setActiveTab] = useState<TabId>('guide');
  const sectionRef = useRef<HTMLElement>(null);

  const currentIndex = TABS.findIndex((t) => t.id === activeTab);
  const prevTab = currentIndex > 0 ? TABS[currentIndex - 1] : null;
  const nextTab = currentIndex < TABS.length - 1 ? TABS[currentIndex + 1] : null;

  const handleTabChange = (newTab: TabId) => {
    setActiveTab(newTab);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="mt-8 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4 sm:p-6 lg:p-8 shadow-xs scroll-mt-20"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--brand-border-subtle)] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--brand-accent)]/30 bg-[var(--brand-accent-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--brand-accent-ink)] mb-2">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Practitioner Field Guide & Safety Manual</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--brand-fg)]">
            How to Unpack Obfuscated JavaScript When You Don't Know What It Does
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[var(--brand-muted)] max-w-3xl leading-relaxed">
            A practical, zero-jargon walkthrough for web developers, security analysts, and everyday users.
            Understand suspicious scripts, strip away scramblers, and verify code safety without sending a single byte to an external server.
          </p>
        </div>

        {/* Client-Side Privacy Guarantee Callout */}
        <div className="shrink-0 flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-2.5 text-xs text-emerald-500">
          <ShieldCheck className="h-5 w-5 shrink-0" />
          <div>
            <div className="font-semibold text-[var(--brand-fg)]">100% In-Browser Privacy</div>
            <div className="text-[11px] text-[var(--brand-muted)]">Zero telemetry · Never uploaded</div>
          </div>
        </div>
      </div>

      {/* Navigation on Mobile: 2-Column High-Visibility Grid (ALL 6 TABS VISIBLE AT A GLANCE) */}
      <div className="mt-6 md:hidden">
        <div className="mb-2 flex items-center justify-between text-[11px] font-mono text-[var(--brand-muted)]">
          <span>SELECT TOPIC:</span>
          <span className="text-[var(--brand-accent)] font-semibold">
            {currentIndex + 1} of {TABS.length}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {TABS.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold transition-all cursor-pointer min-h-[44px] text-left ${
                  isActive
                    ? 'bg-[var(--brand-accent)] text-[var(--brand-accent-fg)] shadow-sm'
                    : 'border border-[var(--brand-border-subtle)] bg-[var(--brand-bg)] text-[var(--brand-fg)] hover:border-[var(--brand-border)] active:scale-98'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-inherit' : 'text-[var(--brand-muted)]'}`} />
                <span className="truncate">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation on Desktop: Sleek Horizontal Pills Bar */}
      <div className="mt-6 hidden md:flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-[var(--brand-border-subtle)] pb-3">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[var(--brand-accent)] text-[var(--brand-accent-fg)] shadow-xs'
                  : 'text-[var(--brand-muted)] hover:text-[var(--brand-fg)] hover:bg-[var(--brand-bg)]'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Comprehensive Field Guide */}
      {activeTab === 'guide' && (
        <div className="mt-6 space-y-6 text-sm text-[var(--brand-fg)] leading-relaxed">
          <div className="rounded-xl border border-[var(--brand-border-subtle)] bg-[var(--brand-bg)]/50 p-4 sm:p-5">
            <p className="text-[var(--brand-fg)]">
              I've lost count of how many times I've opened a plugin file or a web bookmarklet and run straight into a
              solid wall of random symbols and hex codes. Most online tools either choke on larger files or push your code
              through sketchy remote servers where sensitive business logic or API keys could get logged.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-bg)]/30 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2 font-display text-sm font-bold text-[var(--brand-fg)]">
                <Lock className="h-4 w-4 text-[var(--brand-accent)]" />
                <h3>The Legitimate Side of Scrambling</h3>
              </div>
              <p className="text-xs text-[var(--brand-muted)] leading-relaxed">
                Developers scramble code for two very different reasons. Legitimate commercial outfits sometimes do it to
                protect proprietary algorithms or canvas games from being ripped off with a quick right-click and save. In
                those cases, the scrambling is just a basic lock on a screen door to slow down casual copycats. My guess is
                about half the commercial scripts out there use basic array shifts just for that reason.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-bg)]/30 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2 font-display text-sm font-bold text-amber-500">
                <AlertTriangle className="h-4 w-4" />
                <h3>The Threat Actor Side</h3>
              </div>
              <p className="text-xs text-[var(--brand-muted)] leading-relaxed">
                The darker reason is malware. Anyone trying to slip a cryptocurrency miner, a credential stealer, or an
                unwanted redirect into a site will scramble the payload. That way automated security scanners don't spot it
                right away. If you find strange code pasted into a template on your site, finding out what it actually executes
                is your first job. Leaving scrambled code running on a production site is asking for trouble.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-bg)]/30 p-4 sm:p-5">
            <h3 className="font-display text-sm font-bold text-[var(--brand-fg)] mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4 text-[var(--brand-accent)]" />
              Why Automatic Heuristic Detection Matters
            </h3>
            <p className="text-xs text-[var(--brand-muted)] leading-relaxed">
              Trying to guess which encoder someone used can turn into an annoying headache. There are dozens of different
              formats floating around: Obfuscator.IO, old Dean Edwards packers, array decoders, and Japanese emoticon smileys
              like AAencode. If you don't spend your days reading compiler output, you probably won't know the difference
              between an array-shift wrapper and a number-encode function.
            </p>
            <p className="text-xs text-[var(--brand-muted)] leading-relaxed mt-2">
              This is where JSUnpacker Studio makes life easier. Instead of forcing you to click through 14 different radio
              buttons to guess the right encoder, the engine scans the code structure through automatic heuristic detection.
              It checks opening signatures and string array rotation loops, then picks the right decoder on its own.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Visual Recognition: What Scrambled Code Looks Like */}
      {activeTab === 'signatures' && (
        <div className="mt-6 space-y-4">
          <p className="text-xs text-[var(--brand-muted)]">
            Before touching an unknown script, look at the opening lines. Most obfuscators have telltale signatures:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Signature 1: Dean Edwards */}
            <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-bg)]/40 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display text-xs font-bold text-[var(--brand-fg)]">
                  Dean Edwards P.A.C.K.E.R
                </span>
                <span className="rounded bg-[var(--brand-border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--brand-muted)]">
                  Radix Dictionary
                </span>
              </div>
              <p className="text-xs text-[var(--brand-muted)] mb-3">
                Wraps source code inside an eval function with a base-62 dictionary of words separated by pipes.
              </p>
              <pre className="rounded-lg bg-black/40 p-3 font-mono text-[11px] text-[var(--brand-fg)] overflow-x-auto">
                <code>{"eval(function(p,a,c,k,e,r){...}('0 1=2.3(\"4\");',62,5,'var|msg|window|alert|hello'.split('|')))"}</code>
              </pre>
            </div>

            {/* Signature 2: Obfuscator.IO */}
            <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-bg)]/40 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display text-xs font-bold text-[var(--brand-fg)]">
                  Obfuscator.IO (_0x Arrays)
                </span>
                <span className="rounded bg-[var(--brand-border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--brand-muted)]">
                  Hex Array Rotation
                </span>
              </div>
              <p className="text-xs text-[var(--brand-muted)] mb-3">
                Creates an array of hex-escaped strings, rotates it with an IIFE loop, and replaces names with hex keys.
              </p>
              <pre className="rounded-lg bg-black/40 p-3 font-mono text-[11px] text-[var(--brand-fg)] overflow-x-auto">
                <code>{"var _0x5a=['\\x6c\\x6f\\x67'];(function(_0x1,_0x2){...})(_0x5a,0x1f4);console[_0x5a[0]]('test');"}</code>
              </pre>
            </div>

            {/* Signature 3: JSFuck */}
            <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-bg)]/40 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display text-xs font-bold text-[var(--brand-fg)]">
                  JSFuck Encodings
                </span>
                <span className="rounded bg-[var(--brand-border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--brand-muted)]">
                  6-Character ASCII
                </span>
              </div>
              <p className="text-xs text-[var(--brand-muted)] mb-3">
                Uses only 6 characters: <code className="text-[var(--brand-accent)]">[ ] ( ) ! +</code> to reconstruct any JavaScript logic via coercion.
              </p>
              <pre className="rounded-lg bg-black/40 p-3 font-mono text-[11px] text-[var(--brand-fg)] overflow-x-auto">
                <code>[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]][([][(![]+[])[+[]]...])</code>
              </pre>
            </div>

            {/* Signature 4: AAencode / JJencode */}
            <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-bg)]/40 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display text-xs font-bold text-[var(--brand-fg)]">
                  AAencode & JJencode
                </span>
                <span className="rounded bg-[var(--brand-border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--brand-muted)]">
                  Emoticon Symbols
                </span>
              </div>
              <p className="text-xs text-[var(--brand-muted)] mb-3">
                Encodes JavaScript expressions into Japanese emoticons like <code className="text-[var(--brand-accent)]">(ﾟДﾟ) ['_']</code> or symbol operators.
              </p>
              <pre className="rounded-lg bg-black/40 p-3 font-mono text-[11px] text-[var(--brand-fg)] overflow-x-auto">
                <code>ﾟωﾟﾉ= /｀ｍ´/;' _=(ﾟДﾟ) ['_'] ; c=(ﾟΘﾟ) ; (ﾟДﾟ) ['_']((ﾟДﾟ) ['_'](ﾟεﾟ...</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Step-by-Step Walkthrough */}
      {activeTab === 'walkthrough' && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                step: '01',
                title: 'Input Suspicious Code',
                desc: 'Paste code into the left editor, or drag-and-drop a .js file up to 10MB. You can also fetch remote scripts directly.',
              },
              {
                step: '02',
                title: 'Auto-Detect & Execute',
                desc: 'Press Auto-Detect or hit Ctrl+Enter. The engine runs AST heuristic detection and unpacks the logic locally in <20ms.',
              },
              {
                step: '03',
                title: 'Inspect Diff & Unescape',
                desc: 'Toggle the Diff view to see exact transformations. Turn on string unescaping and object path recovery in Options.',
              },
              {
                step: '04',
                title: 'Export Clean Script',
                desc: 'Copy the clean JavaScript to clipboard or export as a .js file for security audit reports and documentation.',
              },
            ].map((s) => (
              <div key={s.step} className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-bg)]/40 p-4">
                <div className="font-mono text-xs font-bold text-[var(--brand-accent)] mb-1">STEP {s.step}</div>
                <h4 className="font-display text-xs font-bold text-[var(--brand-fg)] mb-1.5">{s.title}</h4>
                <p className="text-[11px] text-[var(--brand-muted)] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-[var(--brand-border-subtle)] bg-[var(--brand-bg)]/50 p-4 text-xs text-[var(--brand-muted)] leading-relaxed">
            <strong className="text-[var(--brand-fg)]">Practitioner Tip:</strong> Getting the main wrapper off the code is only half the battle.
            Many obfuscators leave behind messy hex escapes like <code className="font-mono text-[var(--brand-accent)]">\x68\x65\x78</code>.
            Inside the Options menu, keep <strong className="text-[var(--brand-fg)]">Unescape Hex & Unicode</strong> and <strong className="text-[var(--brand-fg)]">Merge String Concats</strong> enabled.
            The studio replaces hex character codes with plain text letters, joins fragmented strings back together, and simplifies awkward bracket lookups like <code className="font-mono text-[var(--brand-accent)]">window['document']['write']</code> into standard dot notation <code className="font-mono text-[var(--brand-accent)]">window.document.write</code>.
          </div>
        </div>
      )}

      {/* Tab 4: Security Checklist */}
      {activeTab === 'safety' && (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-500 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Never blindly run deobfuscated code in your browser console!</span>
              <p className="mt-1 text-[11px] text-[var(--brand-muted)]">
                Even clean-looking code can contain weaponized payloads. Check for these high-risk patterns before executing anything:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-bg)]/30 p-4">
              <div className="font-display text-xs font-bold text-[var(--brand-fg)] mb-2 flex items-center gap-1.5">
                <Search className="h-4 w-4 text-[var(--brand-accent)]" />
                <span>Outbound Phone-Home Calls</span>
              </div>
              <p className="text-[11px] text-[var(--brand-muted)] mb-2">
                Look for network requests reaching out to unfamiliar domains or IP addresses:
              </p>
              <ul className="space-y-1 font-mono text-[11px] text-[var(--brand-fg)]">
                <li>• fetch('https://...')</li>
                <li>• XMLHttpRequest()</li>
                <li>• navigator.sendBeacon(...)</li>
              </ul>
            </div>

            <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-bg)]/30 p-4">
              <div className="font-display text-xs font-bold text-[var(--brand-fg)] mb-2 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-[var(--brand-accent)]" />
                <span>Dynamic DOM Injection</span>
              </div>
              <p className="text-[11px] text-[var(--brand-muted)] mb-2">
                Check whether the script creates hidden script tags to download secondary payloads:
              </p>
              <ul className="space-y-1 font-mono text-[11px] text-[var(--brand-fg)]">
                <li>• document.createElement('script')</li>
                <li>• document.head.appendChild(...)</li>
                <li>• eval(atob(...))</li>
              </ul>
            </div>

            <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-bg)]/30 p-4">
              <div className="font-display text-xs font-bold text-[var(--brand-fg)] mb-2 flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-[var(--brand-accent)]" />
                <span>Credential & Cookie Scraping</span>
              </div>
              <p className="text-[11px] text-[var(--brand-muted)] mb-2">
                If the script reads storage or hooks login form inputs, it is an info-stealer:
              </p>
              <ul className="space-y-1 font-mono text-[11px] text-[var(--brand-fg)]">
                <li>• document.cookie</li>
                <li>• localStorage / sessionStorage</li>
                <li>• input[type=password].value</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Handling Nested / Multi-Layer Obfuscation */}
      {activeTab === 'nested' && (
        <div className="mt-6 space-y-4 text-xs text-[var(--brand-muted)] leading-relaxed">
          <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-bg)]/40 p-4 sm:p-5">
            <h3 className="font-display text-sm font-bold text-[var(--brand-fg)] mb-2">
              What to Do with Nested Obfuscation (The Two-Pass Technique)
            </h3>
            <p>
              Sometimes you will run into a stubborn script that stays somewhat messy even after unpacking it once.
              Threat actors often get sneaky by running code through Dean Edwards packer first and then wrapping that
              entire output inside an Obfuscator.IO hex array. If you unpack it once, you only peel off the outer layer.
            </p>
            <p className="mt-2">
              When that happens, don't worry. Just take the output from the right pane, copy it back into the left input
              pane, and run the auto-detector a second time. Peeling off the second layer usually uncovers the raw, original
              source code. Once both layers are stripped away, you can export the clean script directly as a js file and
              store it for your audit records. It takes maybe ten seconds total.
            </p>
          </div>

          {/* Quick Engine Matrix */}
          <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-bg)]/30 p-4">
            <h4 className="font-display text-xs font-bold text-[var(--brand-fg)] mb-3">
              Supported Deobfuscator Engines (14 Built-In Algorithms)
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                'Dean Edwards P.A.C.K.E.R',
                'Obfuscator.IO Hex Rotator',
                'JavaScript Obfuscator (_0x)',
                'Array Index Decoder',
                'Number Encode',
                'JSFuck ASCII Decoder',
                'AAencode Japanese Emoticons',
                'JJencode Symbol Synthesizer',
                'URLencode & Bookmarklet',
                'Eval Unwrap Sandbox',
                'MyObfuscate Unwrapper',
                'WiseLoop Decoder',
                'Hex Literal Beautifier',
                'Clean Source AST Rebuilder',
              ].map((engine) => (
                <span
                  key={engine}
                  className="rounded-md border border-[var(--brand-border-subtle)] bg-[var(--brand-surface)] px-2.5 py-1 text-[11px] font-mono text-[var(--brand-fg)]"
                >
                  {engine}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Frequently Asked Questions (FAQ) */}
      {activeTab === 'faq' && (
        <div className="mt-6 space-y-3">
          {[
            {
              q: 'How do I deobfuscate JavaScript online safely?',
              a: 'Paste your scrambled code into the input editor or drop a .js file up to 10MB. Click Auto-Detect & Deobfuscate. JSUnpacker Studio analyzes the code structure and unpacks it client-side inside your browser memory without uploading your code to any remote server.',
            },
            {
              q: 'Does JSUnpacker Studio upload my code to an external server?',
              a: 'No. JSUnpacker runs 100% locally in your browser memory using an in-browser Abstract Syntax Tree (AST) engine. No code, API keys, or proprietary snippets are ever transmitted over the network.',
            },
            {
              q: 'Which JavaScript obfuscator formats can JSUnpacker deobfuscate?',
              a: 'JSUnpacker supports 14 obfuscator engines, including Dean Edwards P.A.C.K.E.R, Obfuscator.IO (_0x hex array rotation loops), JSFuck (6-character ASCII), AAencode (Japanese emoticons), JJencode, Array Index Decoders, Number Encoders, Eval Sandbox Wrappers, MyObfuscate, WiseLoop, and URL-encoded bookmarklets.',
            },
            {
              q: 'How do I unpack double or nested obfuscated scripts?',
              a: 'For scripts packed in multiple layers (e.g. Dean Edwards packed inside an Obfuscator.IO hex array), use the two-pass technique: unpack the script once, copy the resulting output back into the input editor, and click Auto-Detect a second time to peel away the inner layer.',
            },
            {
              q: 'What dangerous functions should I check before executing unknown JavaScript?',
              a: 'Before running unpacked code, inspect it for outbound network calls (fetch, XMLHttpRequest, sendBeacon), dynamic script tag creation (document.createElement("script")), and credential scraping (document.cookie, localStorage, or form input hooks).',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-bg)]/40 p-4"
            >
              <h3 className="font-display text-xs sm:text-sm font-bold text-[var(--brand-fg)] mb-1.5 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[var(--brand-accent)] shrink-0" />
                <span>{item.q}</span>
              </h3>
              <p className="text-xs text-[var(--brand-muted)] leading-relaxed pl-6">{item.a}</p>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Stepper: Next / Previous Navigation Bar */}
      <div className="mt-8 pt-4 border-t border-[var(--brand-border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-auto flex justify-start">
          {prevTab ? (
            <button
              onClick={() => handleTabChange(prevTab.id)}
              className="w-full sm:w-auto flex items-center gap-2 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-bg)] px-3.5 py-2.5 text-xs font-medium text-[var(--brand-fg)] hover:border-[var(--brand-accent)] transition-all cursor-pointer min-h-[44px]"
            >
              <ArrowLeft className="h-4 w-4 shrink-0 text-[var(--brand-muted)]" />
              <div className="text-left">
                <div className="text-[10px] text-[var(--brand-muted)] font-mono uppercase">Previous Section</div>
                <div className="font-semibold">{prevTab.shortLabel}</div>
              </div>
            </button>
          ) : (
            <div className="hidden sm:block" />
          )}
        </div>

        {/* Stepper Dots & Index Indicator */}
        <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--brand-muted)]">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              title={t.label}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'w-6 bg-[var(--brand-accent)]'
                  : 'w-2 bg-[var(--brand-border)] hover:bg-[var(--brand-muted)]'
              }`}
            />
          ))}
          <span className="ml-2">
            {currentIndex + 1} / {TABS.length}
          </span>
        </div>

        <div className="w-full sm:w-auto flex justify-end">
          {nextTab ? (
            <button
              onClick={() => handleTabChange(nextTab.id)}
              className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 rounded-xl bg-[var(--brand-accent)] px-4 py-2.5 text-xs font-semibold text-[var(--brand-accent-fg)] hover:bg-[var(--brand-accent-hover)] transition-all cursor-pointer shadow-xs min-h-[44px]"
            >
              <div className="text-left sm:text-right">
                <div className="text-[10px] opacity-80 font-mono uppercase">Next Section</div>
                <div className="font-bold">{nextTab.shortLabel}</div>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>
          ) : (
            <div className="hidden sm:block" />
          )}
        </div>
      </div>
    </section>
  );
};
