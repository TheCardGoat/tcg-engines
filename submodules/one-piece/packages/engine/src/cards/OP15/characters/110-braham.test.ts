import { describe, expect, test } from "vite-plus/test";
import { eb01ConquererOfThreeWorldsRagnaraku039, op08Kalgara098 } from "@tcg/op-cards";
import { op15Braham110 } from "../../../../../cards/src/cards/characters/op15-110-braham.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-110 Braham", () => {
  test("[On K.O.] moves a deck card to Life with a Shandian Warrior Leader", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op08Kalgara098, character: [op15Braham110], activeDon: 2 },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const brahamId = engine.findCardInZone("south", "character", op15Braham110);
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [brahamId] }, "north");
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.lifeCount).toBe(lifeBefore + 1);
    expect(south.deckCount).toBe(deckBefore - 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On K.O.] declined grants no Life", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op08Kalgara098, character: [op15Braham110], activeDon: 2 },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const brahamId = engine.findCardInZone("south", "character", op15Braham110);
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [brahamId] }, "north");
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "0" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.lifeCount).toBe(lifeBefore);
    expect(south.deckCount).toBe(deckBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
