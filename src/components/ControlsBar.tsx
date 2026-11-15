import React, { useState } from 'react';
import type { PackerType, UnpackerOptions } from '../engine/types';
import { PACKER_DEFINITIONS } from '../engine/types';
import { Zap, Settings2, RotateCcw, Check, ChevronDown, Sliders } from 'lucide-react';

interface ControlsBarProps {
  selectedPacker: PackerType;
  onSelectPacker: (packer: PackerType) => void;
  options: UnpackerOptions;
  onChangeOptions: (options: UnpackerOptions) => void;
  onExecute: () => void;
  onReset: () => void;
  isProcessing: boolean;
}

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

  const toggleOption = (key: keyof UnpackerOptions) => {
    onChangeOptions({
      ...options,
      [key]: !options[key],
    });
  };

  const currentPackerDef = PACKER_DEFINITIONS.find((p) => p.id === selectedPacker);

  return (
    <div className="relative border-b border-[var(--brand-border-subtle)] bg-[var(--brand-surface)] px-4 py-2.5 transition-colors duration-150">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        {/* Left: Primary Execution & Method Select */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Main Action Button */}
          <button
            onClick={onExecute}
            disabled={isProcessing}
            className="flex items-center gap-2 rounded-lg bg-[var(--brand-accent)] px-4 py-2 text-xs font-semibold text-[var(--brand-accent-fg)] shadow-xs transition-all hover:bg-[var(--brand-accent-hover)] hover:shadow-md active:scale-98 disabled:opacity-50"
          >
            <Zap className={`h-4 w-4 fill-current ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{selectedPacker === 'auto' ? 'Auto-Detect & Deobfuscate' : 'Deobfuscate Code'}</span>
            <kbd className="hidden rounded bg-black/20 px-1.5 py-0.5 font-mono text-[10px] sm:inline-block">
              Ctrl+Enter
            </kbd>
          </button>

          {/* Unpacker Selector Dropdown */}
          <div className="relative inline-block">
            <select
              value={selectedPacker}
              onChange={(e) => onSelectPacker(e.target.value as PackerType)}
              className="appearance-none rounded-lg border border-[var(--brand-border)] bg-[var(--brand-bg)] py-2 pr-8 pl-3 font-mono text-xs font-medium text-[var(--brand-fg)] transition-all hover:border-[var(--brand-accent)] focus:border-[var(--brand-accent)] focus:outline-none"
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
                <option value="aaencode">AAencode ((ﾟДﾟ) [\'_\'])</option>
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

        {/* Right: Configuration Toggles & Reset */}
        <div className="flex items-center gap-2">
          {/* Settings popover button */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                showSettings
                  ? 'border-[var(--brand-accent)] bg-[var(--brand-accent-soft)] text-[var(--brand-accent-ink)]'
                  : 'border-[var(--brand-border-subtle)] bg-[var(--brand-bg)] text-[var(--brand-fg)] hover:border-[var(--brand-border)]'
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Options</span>
              <span className="rounded bg-[var(--brand-border)] px-1 font-mono text-[10px]">
                {Object.values(options).filter(Boolean).length}
              </span>
            </button>

            {/* Settings dropdown menu */}
            {showSettings && (
              <div className="absolute right-0 top-full z-50 mt-1.5 w-72 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-3 shadow-xl">
                <div className="mb-2 flex items-center justify-between border-b border-[var(--brand-border-subtle)] pb-2 font-display text-xs font-bold text-[var(--brand-fg)]">
                  <span>Transformation Rules</span>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-[10px] text-[var(--brand-muted)] hover:text-[var(--brand-fg)]"
                  >
                    Done
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="flex cursor-pointer items-center justify-between rounded-lg p-1.5 hover:bg-[var(--brand-bg)]">
                    <span className="text-xs text-[var(--brand-fg)]">Format & Indent Code</span>
                    <input
                      type="checkbox"
                      checked={options.formatCode}
                      onChange={() => toggleOption('formatCode')}
                      className="rounded accent-[var(--brand-accent)]"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-lg p-1.5 hover:bg-[var(--brand-bg)]">
                    <span className="text-xs text-[var(--brand-fg)]">Unescape Hex & Unicode</span>
                    <input
                      type="checkbox"
                      checked={options._unescape}
                      onChange={() => toggleOption('_unescape')}
                      className="rounded accent-[var(--brand-accent)]"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-lg p-1.5 hover:bg-[var(--brand-bg)]">
                    <span className="text-xs text-[var(--brand-fg)]">Recover Object Path</span>
                    <input
                      type="checkbox"
                      checked={options.methodChain}
                      onChange={() => toggleOption('methodChain')}
                      className="rounded accent-[var(--brand-accent)]"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-lg p-1.5 hover:bg-[var(--brand-bg)]">
                    <span className="text-xs text-[var(--brand-fg)]">Merge String Concats</span>
                    <input
                      type="checkbox"
                      checked={options.strMerge}
                      onChange={() => toggleOption('strMerge')}
                      className="rounded accent-[var(--brand-accent)]"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-lg p-1.5 hover:bg-[var(--brand-bg)]">
                    <span className="text-xs text-[var(--brand-fg)]">Evaluate Expressions</span>
                    <input
                      type="checkbox"
                      checked={options.calc}
                      onChange={() => toggleOption('calc')}
                      className="rounded accent-[var(--brand-accent)]"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-lg p-1.5 hover:bg-[var(--brand-bg)]">
                    <span className="text-xs text-[var(--brand-fg)]">Remove Redundant Grouping</span>
                    <input
                      type="checkbox"
                      checked={options.removeGrouping}
                      onChange={() => toggleOption('removeGrouping')}
                      className="rounded accent-[var(--brand-accent)]"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-lg p-1.5 hover:bg-[var(--brand-bg)]">
                    <span className="text-xs text-[var(--brand-fg)]">Line Numbers in Output</span>
                    <input
                      type="checkbox"
                      checked={options.lineNumbers}
                      onChange={() => toggleOption('lineNumbers')}
                      className="rounded accent-[var(--brand-accent)]"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Reset button */}
          <button
            onClick={onReset}
            title="Clear all editors"
            className="flex items-center gap-1 rounded-lg border border-[var(--brand-border-subtle)] bg-[var(--brand-bg)] px-2.5 py-1.5 text-xs text-[var(--brand-muted)] transition-all hover:border-[var(--brand-border)] hover:text-[var(--brand-fg)] active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
