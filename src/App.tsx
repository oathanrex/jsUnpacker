import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ControlsBar } from './components/ControlsBar';
import { EditorPane } from './components/EditorPane';
import { OutputPane } from './components/OutputPane';
import { StatsBar } from './components/StatsBar';
import { GuideSection } from './components/GuideSection';
import { executeUnpack } from './engine/unpackerService';
import { CODE_SAMPLES } from './engine/samples';
import { formatJavaScript } from './engine/beautifier';
import type { PackerType, UnpackerOptions, UnpackResult } from './engine/types';
import { FileCode, Sparkles, Columns2 } from 'lucide-react';

const DEFAULT_OPTIONS: UnpackerOptions = {
  formatCode: true,
  _unescape: true,
  methodChain: true,
  strMerge: true,
  calc: false,
  removeGrouping: false,
  lineNumbers: false,
};

export const App: React.FC = () => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('jsunpacker-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('jsunpacker-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Workbench state
  const [inputCode, setInputCode] = useState<string>(() => CODE_SAMPLES[0].code);
  const [selectedPacker, setSelectedPacker] = useState<PackerType>('auto');
  const [options, setOptions] = useState<UnpackerOptions>(DEFAULT_OPTIONS);
  const [result, setResult] = useState<UnpackResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mobileView, setMobileView] = useState<'input' | 'output' | 'split'>('input');

  // Execution handler
  const handleExecute = useCallback(() => {
    if (!inputCode.trim()) {
      setResult(null);
      return;
    }
    setIsProcessing(true);
    // Use setTimeout so UI can paint any active loading state
    setTimeout(() => {
      const res = executeUnpack(inputCode, selectedPacker, options);
      setResult(res);
      setIsProcessing(false);
      // On mobile devices, automatically switch to output tab if in single pane view
      if (window.innerWidth < 1024 && mobileView === 'input') {
        setMobileView('output');
      }
    }, 10);
  }, [inputCode, selectedPacker, options, mobileView]);

  // Execute on initial mount with default sample
  useEffect(() => {
    handleExecute();
  }, []); // Run once on initial load

  // Keyboard shortcut: Ctrl+Enter / Cmd+Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleExecute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleExecute]);

  // Load sample code
  const handleSelectSample = (sampleId: string) => {
    const sample = CODE_SAMPLES.find((s) => s.id === sampleId);
    if (sample) {
      setInputCode(sample.code);
      setSelectedPacker(sample.packer);
      setTimeout(() => {
        const res = executeUnpack(sample.code, sample.packer, options);
        setResult(res);
      }, 20);
    }
  };

  // Clear handler
  const handleClear = () => {
    setInputCode('');
    setResult(null);
  };

  // Re-format clean output
  const handleBeautifyOutput = () => {
    if (!result?.output) return;
    const formatted = formatJavaScript(result.output, {
      unescapeStrings: options._unescape,
    });
    setResult({
      ...result,
      output: formatted,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--brand-bg)] text-[var(--brand-fg)] font-sans antialiased">
      {/* Top Application Bar */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onSelectSample={handleSelectSample}
      />

      {/* Main Command & Configuration Strip */}
      <ControlsBar
        selectedPacker={selectedPacker}
        onSelectPacker={setSelectedPacker}
        options={options}
        onChangeOptions={setOptions}
        onExecute={handleExecute}
        onReset={handleClear}
        isProcessing={isProcessing}
      />

      {/* Main Workspace */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Authoritative Page Title (Semantic H1 for SEO & User Clarity) */}
        <div className="border-b border-[var(--brand-border-subtle)] pb-3">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--brand-accent)]/30 bg-[var(--brand-accent-soft)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--brand-accent-ink)] uppercase tracking-wider">
              100% In-Browser Privacy
            </span>
            <span className="font-mono text-xs text-[var(--brand-muted)]">
              AST Engine v2.0 · Zero Server Telemetry
            </span>
          </div>
          <h1 className="font-display text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-[var(--brand-fg)]">
            Online JavaScript Deobfuscator &amp; Unpacker Studio
          </h1>
          <p className="text-xs sm:text-sm text-[var(--brand-muted)] max-w-3xl leading-relaxed mt-1">
            Safely unpack, reverse engineer, and beautify Dean Edwards Packer, Obfuscator.IO (_0x), JSFuck, AAencode, JJencode, and array rotators client-side without uploading your code to any external server.
          </p>
        </div>

        {/* Mobile View Mode Switcher (Visible on mobile & tablet < lg) */}
        <div className="flex lg:hidden items-center justify-center">
          <div className="inline-flex rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-1 shadow-xs">
            <button
              onClick={() => setMobileView('input')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mobileView === 'input'
                  ? 'bg-[var(--brand-accent)] text-[var(--brand-accent-fg)] shadow-xs'
                  : 'text-[var(--brand-muted)] hover:text-[var(--brand-fg)]'
              }`}
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>Input</span>
            </button>

            <button
              onClick={() => setMobileView('output')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mobileView === 'output'
                  ? 'bg-[var(--brand-accent)] text-[var(--brand-accent-fg)] shadow-xs'
                  : 'text-[var(--brand-muted)] hover:text-[var(--brand-fg)]'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Clean Output</span>
              {result?.output && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
            </button>

            <button
              onClick={() => setMobileView('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mobileView === 'split'
                  ? 'bg-[var(--brand-accent)] text-[var(--brand-accent-fg)] shadow-xs'
                  : 'text-[var(--brand-muted)] hover:text-[var(--brand-fg)]'
              }`}
            >
              <Columns2 className="h-3.5 w-3.5" />
              <span>Split</span>
            </button>
          </div>
        </div>

        {/* Workbench Dual-Pane Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full min-h-[500px]">
          {/* Left: Input Obfuscated Code */}
          <div className={`${mobileView === 'output' ? 'hidden lg:block' : 'block'} h-full min-h-[420px]`}>
            <EditorPane
              value={inputCode}
              onChange={setInputCode}
              onClear={handleClear}
            />
          </div>

          {/* Right: Output Clean Deobfuscated Code */}
          <div className={`${mobileView === 'input' ? 'hidden lg:block' : 'block'} h-full min-h-[420px]`}>
            <OutputPane
              result={result}
              onBeautify={handleBeautifyOutput}
              originalCode={inputCode}
            />
          </div>
        </div>

        {/* Practitioner Field Guide & Educational Manual */}
        <GuideSection />
      </main>

      {/* Bottom Telemetry Status Bar */}
      <StatsBar result={result} />
    </div>
  );
};

export default App;
