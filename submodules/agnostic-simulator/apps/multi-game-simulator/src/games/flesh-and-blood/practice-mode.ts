import type { PracticeMode } from "../../simulator/practiceMode";

export function fabBotStrategyForPracticeMode(
  mode: PracticeMode,
  strategyId: string | null,
): string | null {
  return mode === "self" ? null : strategyId;
}
