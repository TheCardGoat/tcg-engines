import { describe, expect, test } from "vite-plus/test";
import { enumerateChoiceActions } from "../../src/automation/search/shared.ts";
import type { ChoicePrompt } from "../../src/view/player-prompt.ts";

describe("search choice enumeration", () => {
  test("expands every affordable paid-play target without leaking unaffordable cards", () => {
    const choice: ChoicePrompt = {
      type: "chooseTarget",
      chooserId: "p1",
      payload: {
        type: "effectTarget",
        targetPurpose: "playCard",
        eligibleIds: ["cheap", "exact", "expensive"],
        availableEddiesAfterCosts: 2,
        effectiveCostsByCardId: { cheap: 1, exact: 2, expensive: 3 },
      },
    };

    expect(enumerateChoiceActions(choice)).toEqual([
      { kind: "command", move: "resolveEffectTarget", args: { targetIds: ["cheap"] } },
      { kind: "command", move: "resolveEffectTarget", args: { targetIds: ["exact"] } },
    ]);
  });

  test("expands bounded discard combinations and the decline action", () => {
    const choice: ChoicePrompt = {
      type: "chooseTarget",
      chooserId: "p1",
      payload: {
        type: "discardFromHand",
        amount: 2,
        eligibleIds: ["a", "b", "c"],
        canDecline: true,
      },
    };

    expect(enumerateChoiceActions(choice)).toEqual([
      { kind: "command", move: "resolveDiscardFromHand", args: { cardIds: ["a", "b"] } },
      { kind: "command", move: "resolveDiscardFromHand", args: { cardIds: ["a", "c"] } },
      { kind: "command", move: "resolveDiscardFromHand", args: { cardIds: ["b", "c"] } },
      { kind: "command", move: "resolveDiscardFromHand", args: { pass: true } },
    ]);
  });

  test("expands public Gig and trigger choices", () => {
    const gigs: ChoicePrompt = {
      type: "chooseGigsToSteal",
      chooserId: "p1",
      payload: {
        count: 2,
        attackerId: "attacker",
        rivalId: "p2",
        eligibleDice: [
          { dieId: "d1", faceValue: 2 },
          { dieId: "d2", faceValue: 4 },
          { dieId: "d3", faceValue: 6 },
        ],
      },
    };
    const trigger: ChoicePrompt = {
      type: "chooseTrigger",
      chooserId: "p1",
      payload: {
        options: [
          {
            triggerId: "trigger-1",
            sourceCardId: "source",
            sourcePlayerId: "p1",
            abilityIndex: 0,
            abilityText: "Do it",
            cardName: "Source",
          },
        ],
        canPass: true,
      },
    };

    expect(enumerateChoiceActions(gigs)).toHaveLength(3);
    expect(enumerateChoiceActions(trigger)).toEqual([
      { kind: "command", move: "resolveTrigger", args: { triggerId: "trigger-1" } },
      { kind: "command", move: "resolveTrigger", args: { pass: true } },
    ]);
  });
});
