import { describe, expect, it } from "bun:test";

import {
  createPriorityWindowKey,
  isActionablePriorityCategory,
  shouldArmPriorityNudge,
} from "./priority-nudge-state";

describe("priority nudge state", () => {
  it("arms only for the player who currently has priority and can act", () => {
    expect(
      shouldArmPriorityNudge({
        viewerMode: "player",
        isPostGame: false,
        ownerSide: "playerOne",
        prioritySide: "playerOne",
        moveCategoryIds: ["pass-turn"],
        hasActiveSelection: false,
      }),
    ).toBe(true);

    expect(
      shouldArmPriorityNudge({
        viewerMode: "player",
        isPostGame: false,
        ownerSide: "playerOne",
        prioritySide: "playerTwo",
        moveCategoryIds: ["pass-turn"],
        hasActiveSelection: false,
      }),
    ).toBe(false);
  });

  it("does not arm for spectators, post-game states, or undo-only windows", () => {
    expect(
      shouldArmPriorityNudge({
        viewerMode: "spectator",
        isPostGame: false,
        ownerSide: "playerOne",
        prioritySide: "playerOne",
        moveCategoryIds: ["pass-turn"],
        hasActiveSelection: false,
      }),
    ).toBe(false);

    expect(
      shouldArmPriorityNudge({
        viewerMode: "player",
        isPostGame: true,
        ownerSide: "playerOne",
        prioritySide: "playerOne",
        moveCategoryIds: ["pass-turn"],
        hasActiveSelection: false,
      }),
    ).toBe(false);

    expect(isActionablePriorityCategory("undo")).toBe(false);
    expect(
      shouldArmPriorityNudge({
        viewerMode: "player",
        isPostGame: false,
        ownerSide: "playerOne",
        prioritySide: "playerOne",
        moveCategoryIds: ["undo"],
        hasActiveSelection: false,
      }),
    ).toBe(false);
  });

  it("does not arm when there are no available move categories", () => {
    expect(
      shouldArmPriorityNudge({
        viewerMode: "player",
        isPostGame: false,
        ownerSide: "playerOne",
        prioritySide: "playerOne",
        moveCategoryIds: [],
        hasActiveSelection: false,
      }),
    ).toBe(false);
  });

  it("keeps dismissal scoped to a concrete priority window", () => {
    const first = createPriorityWindowKey({
      ownerSide: "playerOne",
      prioritySide: "playerOne",
      stateID: "state-1",
      turnNumber: 2,
      moveCategoryIds: ["pass-turn"],
    });
    const second = createPriorityWindowKey({
      ownerSide: "playerOne",
      prioritySide: "playerOne",
      stateID: "state-2",
      turnNumber: 2,
      moveCategoryIds: ["pass-turn"],
    });

    expect(first).not.toBe(second);
  });
});
