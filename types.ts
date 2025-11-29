export enum AppMode {
  CALCULATOR = 'CALCULATOR',
  CONVERTER = 'CONVERTER'
}

export enum CalculatorMode {
  NORMAL = 'NORMAL',
  SCIENTIFIC = 'SCIENTIFIC'
}

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export enum UnitCategory {
  LENGTH = 'LENGTH',
  WEIGHT = 'WEIGHT',
  TEMPERATURE = 'TEMPERATURE'
}

export const UNIT_RATES: Record<string, number> = {
  // Length (base: meter)
  'm': 1,
  'cm': 0.01,
  'mm': 0.001,
  'km': 1000,
  'in': 0.0254,
  'ft': 0.3048,
  'yd': 0.9144,
  'mi': 1609.34,
  
  // Weight (base: kg)
  'kg': 1,
  'g': 0.001,
  'mg': 0.000001,
  'lb': 0.453592,
  'oz': 0.0283495,
};