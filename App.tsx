import React, { useState, useEffect, useRef } from 'react';
import { History, Moon, Sun, Calculator as CalcIcon, RefreshCcw } from 'lucide-react';
import { AppMode, CalculatorMode, HistoryItem } from './types';
import { Keypad } from './components/Keypad';
import { UnitConverter } from './components/UnitConverter';
import { HistoryDrawer } from './components/HistoryDrawer';
import { evaluateExpression } from './utils/math';

const App: React.FC = () => {
  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // App Mode State
  const [appMode, setAppMode] = useState<AppMode>(AppMode.CALCULATOR);
  const [calcMode, setCalcMode] = useState<CalculatorMode>(CalculatorMode.NORMAL);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Calculator State
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Ref to track if the last keypress was an evaluation (to clear input on next number)
  const isResultFinal = useRef(false);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle Input
  const handleKeyPress = (key: string) => {
    if (isResultFinal.current) {
      // If we just finished a calculation and user types a number/function, start fresh
      // If operator, append to result
      if (['+', '-', '×', '÷', '^'].includes(key)) {
         setInput(result + key);
      } else {
         setInput(key);
      }
      isResultFinal.current = false;
      setResult('');
    } else {
      setInput((prev) => prev + key);
    }
  };

  const handleClear = () => {
    setInput('');
    setResult('');
    isResultFinal.current = false;
  };

  const handleDelete = () => {
    if (isResultFinal.current) {
        handleClear();
    } else {
        setInput((prev) => prev.slice(0, -1));
    }
  };

  const handleEvaluate = () => {
    if (!input) return;
    
    const evalResult = evaluateExpression(input);
    setResult(evalResult);
    
    if (evalResult !== 'Error') {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        expression: input,
        result: evalResult,
        timestamp: Date.now(),
      };
      setHistory((prev) => [newItem, ...prev].slice(0, 50)); // Keep last 50
      isResultFinal.current = true;
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setInput(item.result); // Or item.expression if preferred
    setResult('');
    isResultFinal.current = false;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      {/* Main Container */}
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] relative border border-gray-200 dark:border-gray-800">
        
        {/* Header / Mode Switcher */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 backdrop-blur-sm z-10">
          <div className="flex bg-gray-200 dark:bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setAppMode(AppMode.CALCULATOR)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                appMode === AppMode.CALCULATOR
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <CalcIcon size={16} />
              Calc
            </button>
            <button
              onClick={() => setAppMode(AppMode.CONVERTER)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                appMode === AppMode.CONVERTER
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <RefreshCcw size={16} />
              Conv
            </button>
          </div>
          
          <div className="flex gap-2">
            {appMode === AppMode.CALCULATOR && (
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="History"
              >
                <History size={20} />
              </button>
            )}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {appMode === AppMode.CALCULATOR ? (
            <>
              {/* Display */}
              <div className="flex-1 flex flex-col justify-end p-6 space-y-2 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900">
                <div className="w-full text-right overflow-x-auto no-scrollbar">
                  <span className={`text-gray-500 dark:text-gray-400 font-mono transition-all block whitespace-nowrap ${
                    result ? 'text-lg' : 'text-4xl font-light text-gray-800 dark:text-gray-200'
                  }`}>
                    {input || '0'}
                  </span>
                </div>
                {result && (
                  <div className="w-full text-right overflow-x-auto no-scrollbar">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white font-mono block whitespace-nowrap animate-in slide-in-from-bottom-2 fade-in duration-300">
                      = {result}
                    </span>
                  </div>
                )}
              </div>

              {/* Mode Toggle (Normal vs Scientific) */}
              <div className="flex justify-center pb-2 bg-white dark:bg-gray-900">
                <div className="h-1 w-12 rounded-full bg-gray-200 dark:bg-gray-800 cursor-pointer hover:bg-primary-200 transition-colors"
                   onClick={() => setCalcMode(calcMode === CalculatorMode.NORMAL ? CalculatorMode.SCIENTIFIC : CalculatorMode.NORMAL)}
                   title="Toggle Keypad Mode"
                />
              </div>

              {/* Keypad */}
              <div className="bg-white dark:bg-gray-900 flex-none z-10 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)] rounded-t-3xl">
                 {/* Small indicator for Scientific Mode */}
                 <div className="flex justify-center -mt-3 mb-2">
                    <button 
                        onClick={() => setCalcMode(prev => prev === CalculatorMode.NORMAL ? CalculatorMode.SCIENTIFIC : CalculatorMode.NORMAL)}
                        className="text-[10px] uppercase tracking-wider font-bold text-gray-400 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 px-3 py-1 rounded-full shadow-sm"
                    >
                        {calcMode === CalculatorMode.SCIENTIFIC ? 'Scientific' : 'Basic'}
                    </button>
                 </div>
                <Keypad
                  mode={calcMode}
                  onKeyPress={handleKeyPress}
                  onClear={handleClear}
                  onDelete={handleDelete}
                  onEvaluate={handleEvaluate}
                />
              </div>
            </>
          ) : (
            <UnitConverter />
          )}
        </div>
      </div>

      {/* History Side Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleHistorySelect}
        onClear={() => setHistory([])}
      />
    </div>
  );
};

export default App;