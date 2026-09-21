import { describe, expect, test } from "vite-plus/test";
import { eb01ConquererOfThreeWorldsRagnaraku039, eb01Doma005, op02IceAge117 } from "@tcg/op-cards";
import { op15Enel060 } from "../../../../../cards/src/cards/characters/op15-060-enel.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-060 Enel", () => {
  test("cannot be removed by opponent effects with 6 or less DON!! and gains +2000 power", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Enel060], activeDon: 2 },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const enelId = engine.findCardInZone("south", "character", op15Enel060);

    expect(engine.getView("south").players.south.characters[0]?.power).toBe(10000);

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");

    const south = engine.getView("south").players.south;
    expect(south.characters.some((card) => card?.instanceId === enelId)).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("becomes removable above 6 DON!! and may gain Blocker by trashing a card", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op15Enel060],
        hand: [op02IceAge117],
        activeDon: 7,
      },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const enelId = engine.findCardInZone("south", "character", op15Enel060);

    // Above 6 DON!! the protection and +2000 are gone.
    expect(engine.getView("south").players.south.characters[0]?.power).toBe(8000);

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [enelId] }, "north");

    const south = engine.getView("south").players.south;
    expect(south.trash.map((card) => card.instanceId)).toContain(enelId);
  });

  test("[Activate: Main] pays DON!! 1 and trashes a card to gain Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Enel060], hand: [op02IceAge117], activeDon: 4 },
      { character: [{ card: eb01Doma005, rested: true }], activeDon: 2 },
    );
    const enelId = engine.findCardInZone("south", "character", op15Enel060);
    const iceAgeId = engine.findCardInZone("south", "hand", op02IceAge117);

    engine.activateEffect(enelId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    // The lone hand card is trashed automatically.

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      iceAgeId,
    );

    // The Blocker lasts through the opponent's next End Phase.
    engine.endTurn("south");
    engine.attachDon(engine.leader("north"), 2, "north");
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected a Blocker decision.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(enelId);
    engine.resolveDecision("battleBlocker", { selectedIds: [enelId] }, "south");
  });

  test("[Activate: Main] may be declined", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-060", rested: false }], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const donBefore =
      engine.getView("south").players.south.activeDon +
      engine.getView("south").players.south.restedDon;

    engine.activateEffect(
      engine.findCardInZone("south", "character", "OP15-060"),
      "activateMain",
      "south",
    );
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(
      engine.getView("south").players.south.activeDon +
        engine.getView("south").players.south.restedDon,
    ).toBe(donBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
