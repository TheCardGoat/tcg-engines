export interface AdjustGigOptionInput {
  currentValue: number;
  maxFaceValue: number;
  maxAmount?: number;
  direction?: string;
  chooseUpTo?: boolean;
  minValue?: number;
  maxValue?: number;
}

export interface AdjustGigOption {
  delta: number;
  label: string;
  value: number;
}

export function buildAdjustGigOptions(input: AdjustGigOptionInput): AdjustGigOption[] {
  const options: AdjustGigOption[] = [];
  if (input.minValue !== undefined || input.maxValue !== undefined) {
    const min = Math.max(1, input.minValue ?? 1);
    const max = Math.min(input.maxFaceValue, input.maxValue ?? input.maxFaceValue);
    for (let value = min; value <= max; value += 1) {
      const delta = value - input.currentValue;
      if (delta === 0 && !input.chooseUpTo) {
        continue;
      }
      options.push({
        delta,
        label: delta === 0 ? `Keep at ${value}` : `Set to ${value}`,
        value,
      });
    }
    return options;
  }

  const maxAmount = Math.max(0, input.maxAmount ?? input.maxFaceValue);
  for (let delta = -maxAmount; delta <= maxAmount; delta += 1) {
    if (delta === 0 && !input.chooseUpTo) {
      continue;
    }
    if (input.direction === "increase" && delta < 0) {
      continue;
    }
    if (input.direction === "decrease" && delta > 0) {
      continue;
    }
    const value = input.currentValue + delta;
    if (value < 1 || value > input.maxFaceValue) {
      continue;
    }
    options.push({
      delta,
      label: delta === 0 ? `Keep at ${value}` : `Set to ${value}`,
      value,
    });
  }
  return options;
}
