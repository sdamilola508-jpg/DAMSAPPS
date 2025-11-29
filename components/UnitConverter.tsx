import React, { useState, useEffect } from 'react';
import { UnitCategory, UNIT_RATES } from '../types';
import { ArrowDown } from 'lucide-react';

const UNITS = {
  [UnitCategory.LENGTH]: ['m', 'km', 'cm', 'mm', 'in', 'ft', 'yd', 'mi'],
  [UnitCategory.WEIGHT]: ['kg', 'g', 'mg', 'lb', 'oz'],
  [UnitCategory.TEMPERATURE]: ['C', 'F', 'K'],
};

const UNIT_LABELS: Record<string, string> = {
  'm': 'Meters', 'km': 'Kilometers', 'cm': 'Centimeters', 'mm': 'Millimeters',
  'in': 'Inches', 'ft': 'Feet', 'yd': 'Yards', 'mi': 'Miles',
  'kg': 'Kilograms', 'g': 'Grams', 'mg': 'Milligrams', 'lb': 'Pounds', 'oz': 'Ounces',
  'C': 'Celsius', 'F': 'Fahrenheit', 'K': 'Kelvin'
};

export const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>(UnitCategory.LENGTH);
  const [amount, setAmount] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');
  const [result, setResult] = useState<string>('');

  // Reset units when category changes
  useEffect(() => {
    const defaultUnits = UNITS[category];
    setFromUnit(defaultUnits[0]);
    setToUnit(defaultUnits[1]);
  }, [category]);

  // Calculate conversion
  useEffect(() => {
    if (!amount || isNaN(parseFloat(amount))) {
      setResult('---');
      return;
    }

    const val = parseFloat(amount);
    let converted = 0;

    if (category === UnitCategory.TEMPERATURE) {
      if (fromUnit === toUnit) converted = val;
      else if (fromUnit === 'C' && toUnit === 'F') converted = (val * 9/5) + 32;
      else if (fromUnit === 'F' && toUnit === 'C') converted = (val - 32) * 5/9;
      else if (fromUnit === 'C' && toUnit === 'K') converted = val + 273.15;
      else if (fromUnit === 'K' && toUnit === 'C') converted = val - 273.15;
      else if (fromUnit === 'F' && toUnit === 'K') converted = (val - 32) * 5/9 + 273.15;
      else if (fromUnit === 'K' && toUnit === 'F') converted = (val - 273.15) * 9/5 + 32;
    } else {
      // Linear conversion using base units
      const baseVal = val * (category === UnitCategory.LENGTH || category === UnitCategory.WEIGHT ? UNIT_RATES[fromUnit] : 1);
      converted = baseVal / (category === UnitCategory.LENGTH || category === UnitCategory.WEIGHT ? UNIT_RATES[toUnit] : 1);
    }

    setResult(converted.toLocaleString(undefined, { maximumFractionDigits: 6 }));
  }, [category, amount, fromUnit, toUnit]);

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      {/* Category Tabs */}
      <div className="flex p-1 bg-gray-200 dark:bg-gray-800 rounded-xl">
        {Object.values(UnitCategory).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
              category === cat
                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {cat.toLowerCase()}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-8">
        {/* From Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-1">From</label>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm focus-within:ring-2 ring-primary-500 transition-all">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-3xl font-bold bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-300 mb-2"
              placeholder="0"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-lg p-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer outline-none"
            >
              {UNITS[category].map(u => (
                <option key={u} value={u}>{UNIT_LABELS[u]} ({u})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Divider */}
        <div className="flex justify-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full text-gray-400">
            <ArrowDown size={24} />
          </div>
        </div>

        {/* To Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-1">To</label>
          <div className="bg-primary-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-primary-100 dark:border-gray-700 shadow-sm">
            <div className="w-full text-3xl font-bold text-primary-700 dark:text-primary-400 mb-2 break-all">
              {result}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border-none rounded-lg p-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer outline-none shadow-sm"
            >
              {UNITS[category].map(u => (
                <option key={u} value={u}>{UNIT_LABELS[u]} ({u})</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};