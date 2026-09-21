/** Union of Comprehensive Rules numbers proven by the real-card suite. */
export const COVERED_RULES = new Set<string>();

export function cover(...rules: string[]): void {
  for (const rule of rules) COVERED_RULES.add(rule);
}
