import type { CardSnapshotMap } from "@/features/simulator/model/board-utils.js";
import type { MoveCategorySummary } from "@/features/simulator/model/contracts.js";

export interface QuestAllSummary {
  count: number;
  lore: number;
}

export function getQuestAllSummary(
  moveCategorySummaries: readonly MoveCategorySummary[],
  cardSnapshotsById: CardSnapshotMap,
): QuestAllSummary | null {
  const questAllSummary = moveCategorySummaries.find(
    (summary) => summary.categoryId === "quest-all",
  );
  const questSummary = moveCategorySummaries.find((summary) => summary.categoryId === "quest");

  if (!questAllSummary || !questSummary || questSummary.sourceCardIds.length < 1) {
    return null;
  }

  let totalLore = 0;
  for (const cardId of questSummary.sourceCardIds) {
    totalLore += cardSnapshotsById[cardId]?.loreValue ?? 0;
  }

  return {
    count: questSummary.sourceCardIds.length,
    lore: totalLore,
  };
}
