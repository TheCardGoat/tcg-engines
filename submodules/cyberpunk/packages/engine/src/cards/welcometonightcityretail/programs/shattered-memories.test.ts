import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailShatteredMemories,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const memories = welcomeToNightCityRetailShatteredMemories;

describe("Shattered Memories", () => {
  it("has the exact red Braindance identity and ordered discard, choices, and bonus effects", () => {
    expect(memories).toMatchObject({
      canonicalId: "shattered-memories",
      slug: "shattered-memories",
      name: "Shattered Memories",
      displayName: "Shattered Memories",
      type: "program",
      color: "red",
      classifications: ["Braindance"],
      cost: 4,
      ram: 2,
      hasSellTag: true,
      rarity: "Rare",
      printNumber: "035",
      timingTriggers: ["play"],
      reminderText: ["Discard programs after they resolve."],
      rulesText:
        "Each player discards their hand and may draw 5.\nIf the total number of discarded cards equals the value of a friendly Gig, draw 2.",
      abilities: [
        {
          kind: "triggered",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [
            { effect: "discardFromHand", player: "friendly", amount: "all" },
            { effect: "discardFromHand", player: "rival", amount: "all" },
            {
              effect: "chooseEffect",
              chooser: "friendly",
              options: [
                {
                  id: "draw",
                  label: "Draw 5",
                  effects: [{ effect: "draw", player: "friendly", amount: 5 }],
                },
                { id: "skip", label: "Do not draw", effects: [] },
              ],
            },
            {
              effect: "chooseEffect",
              chooser: "rival",
              options: [
                {
                  id: "draw",
                  label: "Draw 5",
                  effects: [{ effect: "draw", player: "rival", amount: 5 }],
                },
                { id: "skip", label: "Do not draw", effects: [] },
              ],
            },
            {
              effect: "draw",
              player: "friendly",
              amount: 2,
              conditions: [{ condition: "discardedCountMatchesGig", controller: "friendly" }],
            },
          ],
        },
      ],
    });
  });

  it("costs exactly 4 to play", () => {
    const successEngine = CyberpunkTestEngine.createWithFixture({ hand: [memories], eddies: 4 });
    for (const legend of successEngine.getCardsInZone("legendArea", P1)) {
      successEngine.judgeSpendCard(legend, { as: P1 });
    }
    successEngine.playCard(memories, { as: P1 });
    expect(successEngine.getEddies(P1)).toBe(0);

    const failureEngine = CyberpunkTestEngine.createWithFixture({ hand: [memories], eddies: 3 });
    for (const legend of failureEngine.getCardsInZone("legendArea", P1)) {
      failureEngine.judgeSpendCard(legend, { as: P1 });
    }
    expect(() => failureEngine.playCard(memories, { as: P1 })).toThrow(/INSUFFICIENT_EDDIES/);
  });

  it("makes each player discard their hand and then choose whether to draw 5", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [memories, welcomeToNightCityRetailCorpoSecurity],
        deck: Array.from({ length: 20 }, () => welcomeToNightCityRetailFieldOperator),
        eddies: 4,
        gigArea: [{ dieType: "d6", faceValue: 4 }],
      },
      {
        hand: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailFieldOperator],
      },
    );

    engine.playCard(memories, { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("hand", P2)).toHaveLength(0);

    const first = engine.getState().G.turnMetadata.pendingChoice;
    expect(first).toMatchObject({ type: "chooseEffect", chooserId: P1 });
    engine.resolveChooseEffect("draw", { as: P1 });
    const second = engine.getState().G.turnMetadata.pendingChoice;
    expect(second).toMatchObject({ type: "chooseEffect", chooserId: P2 });
    engine.resolveChooseEffect("skip", { as: P2 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(5);
    expect(engine.getCardsInZone("hand", P2)).toHaveLength(0);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      memories.id,
    );
  });

  it("draws 2 extra when the discarded total equals a friendly Gig value", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [memories, welcomeToNightCityRetailCorpoSecurity],
        deck: Array.from({ length: 20 }, () => welcomeToNightCityRetailFieldOperator),
        eddies: 4,
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      {
        hand: [welcomeToNightCityRetailFieldOperator],
      },
    );
    const deckBefore = engine.getCardsInZone("deck", P1).length;

    engine.playCard(memories, { as: P1 });
    let guard = 0;
    while (engine.getState().G.turnMetadata.pendingChoice && guard < 4) {
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      if (choice?.type !== "chooseEffect") break;
      engine.resolveChooseEffect("skip", { as: choice.chooserId });
      guard += 1;
    }

    expect(engine.getCardsInZone("deck", P1).length).toBe(deckBefore - 2);
  });

  it("does not draw the bonus when the discarded total matches no friendly Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [memories, welcomeToNightCityRetailCorpoSecurity],
        deck: Array.from({ length: 10 }, () => welcomeToNightCityRetailFieldOperator),
        eddies: 4,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
      { hand: [welcomeToNightCityRetailFieldOperator] },
    );
    const deckBefore = engine.getCardsInZone("deck", P1).length;

    engine.playCard(memories, { as: P1 });
    engine.resolveChooseEffect("skip", { as: P1 });
    engine.resolveChooseEffect("skip", { as: P2 });

    expect(engine.getCardsInZone("deck", P1)).toHaveLength(deckBefore);
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
  });
});
