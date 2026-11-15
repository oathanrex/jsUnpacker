import React, { useState, useEffect, useRef } from 'react';
import type { PackerType, UnpackerOptions } from '../engine/types';
import { PACKER_DEFINITIONS } from '../engine/types';
import { Zap, RotateCcw, Check, ChevronDown, Sliders, X } from 'lucide-react';

interface ControlsBarProps {
  selectedPacker: PackerType;
  onSelectPacker: (packer: PackerType) => void;
  options: UnpackerOptions;
  onChangeOptions: (options: UnpackerOptions) => void;
  onExecute: () => void;
  onReset: () => void;
  isProcessing: boolean;
}

interface OptionConfigItem {
  key: keyof UnpackerOptions;
  label: string;
  description: string;
}

const OPTIONS_CONFIG: OptionConfigItem[] = [
  {
    key: 'formatCode',
    label: 'Format & Indent Code',
    description: 'Beautifies and indents the unpacked output with clean line spacing',
  },
  {
    key: '_unescape',
    label: 'Unescape Hex & Unicode',
    description: 'Turns \\x68\\x65 literals and unicode escapes into readable characters',
  },
  {
    key: 'methodChain',
    label: 'Recover Object Paths',
    description: "Converts bracket lookups like window['document'] into window.document",
  },
  {
    key: 'strMerge',
    label: 'Merge String Concats',
    description: "Joins fragmented strings connected by plus signs ('a' + 'b' -> 'ab')",
  },
  {
    key: 'calc',
    label: 'Evaluate Expressions',
    description: 'Safely calculates constant arithmetic expressions and bitwise logic',
  },
  {
    key: 'removeGrouping',
    label: 'Remove Redundant Parentheses',
    description: 'Strips unnecessary wrapping brackets around simple statements',
  },
  {
    key: 'lineNumbers',
    label: 'Line Numbers in Output',
    description: 'Prepends sequential line numbers to the deobfuscated output',
  },
];

export const ControlsBar: React.FC<ControlsBarProps> = ({
  selectedPacker,
  onSelectPacker,
  options,
  onChangeOptions,
  onExecute,
  onReset,
  isProcessing,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleOption = (key: keyof UnpackerOptions) => {
    onChangeOptions({
      ...options,
      [key]: !options[key],
    });
  };

  // Close on outside click for desktop popover & escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowSettings(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    };

    if (showSettings) {
      window.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettings]);

  const currentPackerDef = PACKER_DEFINITIONS.find((p) => p.id === selectedPacker);
  const activeOptionsCount = Object.values(options).filter(Boolean).length;

  return (
    <div
      ref={containerRef}
      className="relative border-b border-[var(--brand-border-subtle)] bg-[var(--brand-surface)] px-3 sm:px-4 py-2 sm:py-2.5 transition-colors duration-150"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2.5 sm:gap-3">
        {/* Left: Primary Execution & Method Select */}
        <div className="flex flex-1 flex-wrap items-center gap-2 sm:gap-2.5 min-w-[260px]">
          {/* Main Action Button */}
          <button
            onClick={onExecute}
            disabled={isProcessing}
            className="flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-lg bg-[var(--brand-accent)] px-3.5 sm:px-4 py-2 text-xs font-semibold text-[var(--brand-accent-fg)] shadow-xs transition-all hover:bg-[var(--brand-accent-hover)] hover:shadow-md active:scale-98 disabled:opacity-50 min-h-[38px] whitespace-nowrap cursor-pointer"
          >
            <Zap className={`h-4 w-4 fill-current shrink-0 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{selectedPacker === 'auto' ? 'Auto-Detect & Deobfuscate' : 'Deobfuscate Code'}</span>
            <kbd className="hidden rounded bg-black/20 px-1.5 py-0.5 font-mono text-[10px] md:inline-block">
              Ctrl+Enter
            </kbd>
          </button>

          {/* Unpacker Selector Dropdown */}
          <div className="relative flex-1 sm:flex-initial min-w-[150px] sm:min-w-[210px]">
            <select
              id="unpacker-engine-select"
              name="unpacker-engine-select"
              value={selectedPacker}
              onChange={(e) => onSelectPacker(e.target.value as PackerType)}
              aria-label="Deobfuscation engine selector"
              className="w-full appearance-none rounded-lg border border-[var(--brand-border)] bg-[var(--brand-bg)] py-2 pr-8 pl-3 font-mono text-xs font-medium text-[var(--brand-fg)] transition-all hover:border-[var(--brand-accent)] focus:border-[var(--brand-accent)] focus:outline-none min-h-[38px] cursor-pointer"
            >
              <optgroup label="Auto Detection">
                <option value="auto">Auto-Detect (Heuristic AST)</option>
              </optgroup>
              <optgroup label="Popular & Modern">
                <option value="p_a_c_k_e_r">Dean Edwards P.A.C.K.E.R</option>
                <option value="obfuscatorio">Obfuscator.IO (Hex & Array Rotation)</option>
                <option value="javascriptobfuscator">JS Obfuscator (_0x arrays)</option>
                <option value="cleansource">Clean Source & Beautify</option>
              </optgroup>
              <optgroup label="Array & Numerical">
                <option value="arrayencode">Array Decoder (String Indexing)</option>
                <option value="numberencode">_Number Obfuscator</option>
              </optgroup>
              <optgroup label="Esoteric & ASCII">
                <option value="jsfuck">JSFuck ([][(![]+[])[+[]]...])</option>
                <option value="aaencode">AAencode ((ﾟДﾟ) ['_'])</option>
                <option value="jjencode">JJencode ($=~[];$={'{...}'})</option>
                <option value="urlencode">URLencode / Bookmarklet</option>
              </optgroup>
              <optgroup label="Eval & Wrappers">
                <option value="evalencode">Eval Unwrap Sandbox</option>
                <option value="myobfuscate">MyObfuscate</option>
                <option value="wise">WiseLoop Obfuscator</option>
              </optgroup>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-[var(--brand-muted)]" />
          </div>

          {currentPackerDef && (
            <span className="hidden font-mono text-xs text-[var(--brand-muted)] xl:inline-block">
              {currentPackerDef.badge}
            </span>
          )}
        </div>

        {/* Right: Options & Reset */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Options Button */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              aria-expanded={showSettings}
              aria-label="Deobfuscation options"
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all min-h-[38px] cursor-pointer ${
                showSettings
                  ? 'border-[var(--brand-accent)] bg-[var(--brand-accent-soft)] text-[var(--brand-accent-ink)]'
                  : 'border-[var(--brand-border-subtle)] bg-[var(--brand-bg)] text-[var(--brand-fg)] hover:border-[var(--brand-border)]'
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Options</span>
              <span className="rounded bg-[var(--brand-border)] px-1.5 py-0.2 font-mono text-[10px]">
                {activeOptionsCount}
              </span>
            </button>

            {/* Options Panel: Responsive Sheet on Mobile, Popover on Desktop */}
            {showSettings && (
              <>
                {/* Backdrop on mobile */}
                <div
                  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs sm:hidden"
                  onClick={() => setShowSettings(false)}
                  aria-hidden="true"
                />

                {/* Dialog Content */}
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Transformation Options"
                  className="fixed inset-x-3 top-20 z-50 max-h-[85vh] overflow-y-auto rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4 shadow-2xl sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-1.5 sm:w-84 sm:max-h-none sm:rounded-xl sm:p-3 sm:shadow-xl"
                >
                  <div className="mb-2.5 flex items-center justify-between border-b border-[var(--brand-border-subtle)] pb-2 font-display text-xs font-bold text-[var(--brand-fg)]">
                    <div className="flex items-center gap-1.5">
                      <Sliders className="h-4 w-4 text-[var(--brand-accent)]" />
                      <span>Transformation Rules</span>
                    </div>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-[var(--brand-muted)] hover:bg-[var(--brand-border-subtle)] hover:text-[var(--brand-fg)] cursor-pointer"
                    >
                      <X className="h-4 w-4 sm:hidden" />
                      <span className="hidden sm:inline text-[10px]">Done</span>
                      <span className="sm:hidden font-medium">Close</span>
                    </button>
                  </div>

                  <div className="space-y-1">
                    {OPTIONS_CONFIG.map(({ key, label, description }) => (
                      <label
                        key={key}
                        className="flex cursor-pointer items-start justify-between gap-3 rounded-lg p-2 transition-colors hover:bg-[var(--brand-bg)] active:bg-[var(--brand-border-subtle)]"
                      >
                        <div className="flex flex-col pr-2">
                          <span className="text-xs font-medium text-[var(--brand-fg)]">{label}</span>
                          <span className="text-[11px] text-[var(--brand-muted)] leading-tight mt-0.5">
                            {description}
                          </span>
                        </div>
                        <input
                          id={`unpacker-rule-${key}`}
                          name={`unpacker-rule-${key}`}
                          type="checkbox"
                          checked={options[key]}
                          onChange={() => toggleOption(key)}
                          className="mt-1 h-4 w-4 shrink-0 rounded border-[var(--brand-border)] accent-[var(--brand-accent)] cursor-pointer"
                        />
                      </label>
                    ))}
                  </div>

                  {/* Mobile confirmation button */}
                  <div className="mt-3 pt-2 border-t border-[var(--brand-border-subtle)] sm:hidden">
                    <button
                      onClick={() => setShowSettings(false)}
                      className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[var(--brand-accent)] py-2.5 text-xs font-semibold text-[var(--brand-accent-fg)] cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Apply & Close</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Reset button */}
          <button
            onClick={onReset}
            title="Clear input and output code"
            className="flex items-center gap-1 rounded-lg border border-[var(--brand-border-subtle)] bg-[var(--brand-bg)] px-2.5 sm:px-3 py-2 text-xs text-[var(--brand-muted)] transition-all hover:border-[var(--brand-border)] hover:text-[var(--brand-fg)] active:scale-95 min-h-[38px] cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
