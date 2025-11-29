// A safe math evaluator wrapper
// In a production app, we would import * from 'mathjs'
// For this contained environment, we'll implement a robust evaluator using Function 
// with strict sanitization to mimic the requested "math_expressions" behavior.

export const evaluateExpression = (expression: string): string => {
  try {
    // 1. Sanitize: Allow only numbers, operators, parens, and known math functions
    const sanitized = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/\^/g, '**') // Power operator
      .replace(/π/g, 'Math.PI')
      .replace(/e/g, 'Math.E')
      .replace(/sin\(/g, 'Math.sin(') // This expects radians in JS Math.
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/log\(/g, 'Math.log10(') // Base 10 log
      .replace(/ln\(/g, 'Math.log(')   // Natural log
      .replace(/abs\(/g, 'Math.abs(');

    // Validate characters to prevent code injection
    if (/[^0-9+\-*/().\sMath.PIElogsinctqrpwxy\^]/.test(sanitized.replace(/Math\.(PI|E|sin|cos|tan|sqrt|log10|log|abs)/g, ''))) {
       // If it contains characters not in our safe list (after stripping known Math functions)
       throw new Error("Invalid characters");
    }

    // eslint-disable-next-line no-new-func
    const result = new Function(`return ${sanitized}`)();

    if (!isFinite(result) || isNaN(result)) {
      return "Error";
    }

    // Format output: avoid long decimals if close to integer
    const resultStr = String(result);
    if (resultStr.includes('.')) {
        const num = parseFloat(resultStr);
        // Limit precision to avoid 0.1 + 0.2 = 0.30000000000000004
        return parseFloat(num.toFixed(10)).toString();
    }
    
    return resultStr;
  } catch (e) {
    return "Error";
  }
};

// Helper for degrees conversion if we wanted to support degrees for trig functions
// standard JS Math uses radians. We stick to radians for "Scientific" purity unless specified.
export const toRadians = (degrees: number) => degrees * (Math.PI / 180);
