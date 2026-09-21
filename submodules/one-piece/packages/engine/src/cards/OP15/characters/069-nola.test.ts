import { describe, expect, test } from "vite-plus/test";
import { eb01ConquererOfThreeWorldsRagnaraku039 } from "@tcg/op-cards";
import { op15Nola069 } from "../../../../../cards/src/cards/characters/op15-069-nola.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-069 Nola", () => {
  test("saves itself by returning a DON!! to the DON!! deck", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Nola069], activeDon: 2 },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const nolaId = engine.findCardInZone("south", "character", op15Nola069);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [nolaId] }, "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
    engine.resolveDecision("effectReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.characters.some((card) => card?.instanceId === nolaId)).toBe(true);
    expect(south.donDeckCount).toBe(donDeckBefore + 1);
    expect(south.activeDon + south.restedDon).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the replacement lets the K.O. through", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Nola069], activeDon: 2 },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const nolaId = engine.findCardInZone("south", "character", op15Nola069);

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [nolaId] }, "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "no" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.trash.map((card) => card.instanceId)).toContain(nolaId);
    expect(south.donDeckCount).toBe(10);
  });
});
