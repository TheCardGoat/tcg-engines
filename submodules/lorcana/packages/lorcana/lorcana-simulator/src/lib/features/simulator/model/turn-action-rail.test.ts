import { describe, expect, it } from "bun:test";
import { getQuestAllSummary } from "./turn-action-rail.js";
import type { CardSnapshotMap } from "@/features/simulator/model/board-utils.js";
import type { MoveCategorySummary } from "@/features/simulator/model/contracts.js";

const cardSnapshotsById = {
  cardA: {
    cardId: "cardA",
    definitionId: "def-cardA",
    isMasked: false,
    label: "Quester A",
    ownerId: "player-1",
    ownerSide: "playerOne",
    zoneId: "play",
    loreValue: 2,
    facePresentation: "faceUp",
  },
  cardB: {
    cardId: "cardB",
    definitionId: "def-cardB",
    isMasked: false,
    label: "Quester B",
    ownerId: "player-1",
    ownerSide: "playerOne",
    zoneId: "play",
    loreValue: 3,
    facePresentation: "faceUp",
  },
} satisfies CardSnapshotMap;

describe("turn-action-rail", () => {
  it("returns the quest-all count and summed lore when quest-all is available", () => {
    const summaries: MoveCategorySummary[] = [
      {
        categoryId: "quest",
        categoryLabel: "Quest",
        sourceCardIds: ["cardA", "cardB"],
        isDirect: false,
      },
      {
        categoryId: "quest-all",
        categoryLabel: "Quest with All",
        sourceCardIds: [],
        isDirect: true,
      },
    ];

    expect(getQuestAllSummary(summaries, cardSnapshotsById)).toEqual({
      count: 2,
      lore: 5,
    });
  });

  it("returns the quest-all summary for a single available quester", () => {
    const summaries: MoveCategorySummary[] = [
      {
        categoryId: "quest",
        categoryLabel: "Quest",
        sourceCardIds: ["cardA"],
        isDirect: false,
      },
      {
        categoryId: "quest-all",
        categoryLabel: "Quest with All",
        sourceCardIds: [],
        isDirect: true,
      },
    ];

    expect(getQuestAllSummary(summaries, cardSnapshotsById)).toEqual({
      count: 1,
      lore: 2,
    });
  });

  it("returns null when quest-all is unavailable", () => {
    const summaries: MoveCategorySummary[] = [
      {
        categoryId: "quest",
        categoryLabel: "Quest",
        sourceCardIds: ["cardA"],
        isDirect: false,
      },
    ];

    expect(getQuestAllSummary(summaries, cardSnapshotsById)).toBeNull();
  });
});
