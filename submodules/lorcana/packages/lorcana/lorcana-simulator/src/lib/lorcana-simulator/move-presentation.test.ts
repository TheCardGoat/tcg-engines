import { describe, expect, it } from "bun:test";

import {
  getMoveCategoryEntryCount,
  getMoveCategoryGroupCount,
  getMoveCategoryId,
  getMoveCategoryLabel,
  sortMoveCategories,
} from "@/features/simulator/model/move-presentation.js";
import type {
  ExecutableMoveEntry,
  ExecutableMovePresentationCategoryId,
} from "@/features/simulator/model/contracts.js";

describe("lorcana move presentation", () => {
  it("maps activate ability and move to location into dedicated categories", () => {
    expect(getMoveCategoryId("activateAbility")).toBe("activate-ability");
    expect(getMoveCategoryId("moveCharacterToLocation")).toBe("move-to-location");
  });

  it("returns user-facing labels for activate ability and move to location", () => {
    expect(getMoveCategoryLabel("activateAbility")).toBe("Activate Ability");
    expect(getMoveCategoryLabel("moveCharacterToLocation")).toBe("Move to Location");
  });

  it("counts source-first categories by unique source card", () => {
    const challengeMoves: ExecutableMoveEntry[] = [
      {
        id: "challenge:a:d1",
        label: "A -> D1",
        moveId: "challenge",
        params: { attackerId: "a", defenderId: "d1" },
        presentation: {
          kind: "targeted",
          categoryId: "challenge",
          categoryLabel: "Challenge",
          optionLabel: "A -> D1",
        },
      },
      {
        id: "challenge:a:d2",
        label: "A -> D2",
        moveId: "challenge",
        params: { attackerId: "a", defenderId: "d2" },
        presentation: {
          kind: "targeted",
          categoryId: "challenge",
          categoryLabel: "Challenge",
          optionLabel: "A -> D2",
        },
      },
      {
        id: "challenge:b:d3",
        label: "B -> D3",
        moveId: "challenge",
        params: { attackerId: "b", defenderId: "d3" },
        presentation: {
          kind: "targeted",
          categoryId: "challenge",
          categoryLabel: "Challenge",
          optionLabel: "B -> D3",
        },
      },
    ];

    expect(getMoveCategoryEntryCount("challenge", challengeMoves)).toBe(2);
  });

  it("counts available-move groups by category rather than raw move entries", () => {
    const moves: ExecutableMoveEntry[] = [
      {
        id: "quest:a",
        label: "Quest",
        moveId: "quest",
        params: { cardId: "a" },
        presentation: {
          kind: "targeted",
          categoryId: "quest",
          categoryLabel: "Quest",
          optionLabel: "A",
        },
      },
      {
        id: "challenge:a:d1",
        label: "A -> D1",
        moveId: "challenge",
        params: { attackerId: "a", defenderId: "d1" },
        presentation: {
          kind: "targeted",
          categoryId: "challenge",
          categoryLabel: "Challenge",
          optionLabel: "A -> D1",
        },
      },
      {
        id: "challenge:a:d2",
        label: "A -> D2",
        moveId: "challenge",
        params: { attackerId: "a", defenderId: "d2" },
        presentation: {
          kind: "targeted",
          categoryId: "challenge",
          categoryLabel: "Challenge",
          optionLabel: "A -> D2",
        },
      },
    ];

    expect(getMoveCategoryGroupCount(moves)).toBe(2);
  });
});
