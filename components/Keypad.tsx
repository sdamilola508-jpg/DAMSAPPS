import React from 'react';
import { CalculatorMode } from '../types';
import { Delete, Equal } from 'lucide-react';

interface KeypadProps {
  mode: CalculatorMode;
  onKeyPress: (key: string) => void;
  onClear: () => void;
  onDelete: () => void;
  onEvaluate: () => void;
}

const Button: React.FC<{
  label: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  className?: string;
}> = ({ label, onClick, variant = 'default', className = '' }) => {
  const baseStyles = "relative overflow-hidden rounded-2xl p-4 text-xl font-medium transition-all active:scale-95 flex items-center justify-center select-none touch-action-manipulation";
  
  const variants = {
    default: "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm border-b-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700",
    primary: "bg-primary-500 text-white shadow-lg shadow-primary-500/30 border-b-2 border-primary-700 hover:bg-primary-400",
    secondary: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-b-2 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600",
    accent: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-b-2 border-orange-200 dark:border-orange-800 hover:bg-orange-200 dark:hover:bg-orange-900/50"
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {label}
    </button>
  );
};

export const Keypad: React.FC<KeypadProps> = ({ mode, onKeyPress, onClear, onDelete, onEvaluate }) => {
  const isScientific = mode === CalculatorMode.SCIENTIFIC;

  return (
    <div className={`grid gap-3 p-4 pb-8 transition-all duration-300 ${
      isScientific ? 'grid-cols-5' : 'grid-cols-4'
    }`}>
      {/* Row 1 */}
      <Button label="AC" onClick={onClear} variant="accent" />
      {isScientific && <Button label="(" onClick={() => onKeyPress('(')} variant="secondary" />}
      {isScientific && <Button label=")" onClick={() => onKeyPress(')')} variant="secondary" />}
      <Button label={<Delete size={24} />} onClick={onDelete} variant="secondary" className={!isScientific ? "col-span-2" : ""} />
      <Button label="÷" onClick={() => onKeyPress('÷')} variant="secondary" />

      {/* Row 2 (Scientific extra row if needed, or inline) */}
      {isScientific && (
        <>
          <Button label="sin" onClick={() => onKeyPress('sin(')} variant="secondary" className="text-base" />
          <Button label="cos" onClick={() => onKeyPress('cos(')} variant="secondary" className="text-base" />
          <Button label="tan" onClick={() => onKeyPress('tan(')} variant="secondary" className="text-base" />
          <Button label="^" onClick={() => onKeyPress('^')} variant="secondary" />
          <Button label="√" onClick={() => onKeyPress('sqrt(')} variant="secondary" />
        </>
      )}

      {/* Row 3 */}
      {isScientific && <Button label="ln" onClick={() => onKeyPress('ln(')} variant="secondary" className="text-base" />}
      <Button label="7" onClick={() => onKeyPress('7')} />
      <Button label="8" onClick={() => onKeyPress('8')} />
      <Button label="9" onClick={() => onKeyPress('9')} />
      <Button label="×" onClick={() => onKeyPress('×')} variant="secondary" />

      {/* Row 4 */}
      {isScientific && <Button label="log" onClick={() => onKeyPress('log(')} variant="secondary" className="text-base" />}
      <Button label="4" onClick={() => onKeyPress('4')} />
      <Button label="5" onClick={() => onKeyPress('5')} />
      <Button label="6" onClick={() => onKeyPress('6')} />
      <Button label="-" onClick={() => onKeyPress('-')} variant="secondary" />

      {/* Row 5 */}
      {isScientific && <Button label="π" onClick={() => onKeyPress('π')} variant="secondary" />}
      <Button label="1" onClick={() => onKeyPress('1')} />
      <Button label="2" onClick={() => onKeyPress('2')} />
      <Button label="3" onClick={() => onKeyPress('3')} />
      <Button label="+" onClick={() => onKeyPress('+')} variant="secondary" />

      {/* Row 6 */}
      {isScientific && <Button label="e" onClick={() => onKeyPress('e')} variant="secondary" />}
      <Button label="0" onClick={() => onKeyPress('0')} className="col-span-2" />
      <Button label="." onClick={() => onKeyPress('.')} />
      <Button label={<Equal size={28} />} onClick={onEvaluate} variant="primary" />
    </div>
  );
};