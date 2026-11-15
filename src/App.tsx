import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ControlsBar } from './components/ControlsBar';
import { EditorPane } from './components/EditorPane';
import { OutputPane } from './components/OutputPane';
import { StatsBar } from './components/StatsBar';
import { executeUnpack } from './engine/unpackerService';
import { CODE_SAMPLES } from './engine/samples';
import { formatJavaScript } from './engine/beautifier';
import type { PackerType, UnpackerOptions, UnpackResult } from './engine/types';

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
    }, 10);
  }, [inputCode, selectedPacker, options]);

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

      {/* Workbench Dual-Pane Layout */}
      <main className="flex-1 p-3 sm:p-4 max-w-7xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full min-h-[540px]">
          {/* Left: Input Obfuscated Code */}
          <EditorPane
            value={inputCode}
            onChange={setInputCode}
            onClear={handleClear}
          />

          {/* Right: Output Clean Deobfuscated Code */}
          <OutputPane
            result={result}
            onBeautify={handleBeautifyOutput}
            originalCode={inputCode}
          />
        </div>
      </main>

      {/* Bottom Telemetry Status Bar */}
      <StatsBar result={result} />
    </div>
  );
};

export default App;
