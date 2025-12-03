const isWithin = (value = 0, lower = 0, upper = 0) => {
  return value >= lower && value <= upper;
};

export const initValueStepper = ({ min = 0, max = 5, direction, increment = 0.05, initial = 0 } = {}) => {
  let currentValue = initial;
  let stepValue = increment;
  const withinMinMax = (value) => isWithin(value, min, max)
  
  const getValue = (delta = 8) => {
    currentValue = currentValue + stepValue;
    stepValue = withinMinMax(currentValue) ? stepValue : -stepValue;
    
    return currentValue;
  };
  
  return getValue;
};