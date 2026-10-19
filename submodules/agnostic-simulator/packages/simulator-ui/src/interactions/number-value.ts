export type Bounds = { min?: number; max?: number; step?: number };

export function isLegalNumber(value: number | undefined, { min, max, step }: Bounds): boolean {
  if (value === undefined || !Number.isFinite(value)) return false;
  if ((min !== undefined && value < min) || (max !== undefined && value > max)) return false;
  if (step === undefined) return true;
  const steps = (value - (min ?? 0)) / step;
  return Math.abs(steps - Math.round(steps)) < 1e-9;
}
