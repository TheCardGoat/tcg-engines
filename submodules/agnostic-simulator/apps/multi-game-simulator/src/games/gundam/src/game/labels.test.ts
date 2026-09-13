import { describe, expect, it } from "vitest";

import { displayTurn, projectGundamControlState } from "./labels.ts";

describe("displayTurn", () => {
  it("converts the engine's zero-indexed turn count for players", () => {
    expect(displayTurn(0)).toBe(1);
    expect(displayTurn(1)).toBe(2);
  });
});

describe("projectGundamControlState", () => {
  it.each([
    [
      "same viewer turn and priority",
      { phase: "main-phase", activePlayer: "p1", turnPlayer: "p1" },
      { kind: "interactive", turnOwner: "self", priorityHolder: "self" },
    ],
    [
      "same opponent turn and priority",
      { phase: "main-phase", activePlayer: "p2", turnPlayer: "p2" },
      { kind: "interactive", turnOwner: "opponent", priorityHolder: "opponent" },
    ],
    [
      "viewer priority during opponent turn",
      { phase: "battle-phase", step: "block-step", activePlayer: "p1", turnPlayer: "p2" },
      { kind: "interactive", turnOwner: "opponent", priorityHolder: "self" },
    ],
    [
      "opponent priority during viewer turn",
      { phase: "battle-phase", step: "action-step", activePlayer: "p2", turnPlayer: "p1" },
      { kind: "interactive", turnOwner: "self", priorityHolder: "opponent" },
    ],
  ] as const)("%s", (_label, status, expected) => {
    expect(projectGundamControlState(status, "p1")).toEqual(expected);
  });

  it.each(["attack-step", "damage-step", "battle-end-step"])(
    "treats %s as resolving without a pending interaction",
    (step) => {
      expect(
        projectGundamControlState(
          {
            phase: "battle-phase",
            step,
            activePlayer: "p1",
            turnPlayer: "p2",
          },
          "p1",
        ),
      ).toEqual({ kind: "resolving", turnOwner: "opponent" });
    },
  );

  it("preserves priority for a pending interaction in the damage step", () => {
    expect(
      projectGundamControlState(
        {
          phase: "battle-phase",
          step: "damage-step",
          activePlayer: "p1",
          turnPlayer: "p2",
        },
        "p1",
        true,
      ),
    ).toEqual({ kind: "interactive", turnOwner: "opponent", priorityHolder: "self" });
  });

  it("falls back to the active player for turn ownership", () => {
    expect(projectGundamControlState({ phase: "main-phase", activePlayer: "p2" }, "p1")).toEqual({
      kind: "interactive",
      turnOwner: "opponent",
      priorityHolder: "opponent",
    });
  });
});
