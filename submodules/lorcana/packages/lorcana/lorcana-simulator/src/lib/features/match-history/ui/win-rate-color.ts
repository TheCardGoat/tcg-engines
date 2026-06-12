export function winRateTextClass(rate: number): string {
  if (rate >= 55) return "text-emerald-400";
  if (rate >= 45) return "text-amber-400";
  return "text-red-400";
}

export function winRateBarClass(rate: number): string {
  if (rate >= 55) return "bg-emerald-400";
  if (rate >= 45) return "bg-amber-400";
  return "bg-red-400";
}

export function winRateBarBgClass(rate: number): string {
  if (rate >= 55) return "bg-emerald-500/20";
  if (rate >= 45) return "bg-amber-500/20";
  return "bg-red-500/20";
}
