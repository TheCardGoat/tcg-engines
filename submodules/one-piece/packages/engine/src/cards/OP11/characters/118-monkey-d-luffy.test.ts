import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { op11MonkeyDLuffy118 } from "../../../../../cards/src/cards/characters/op11-118-monkey-d-luffy.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-118 Monkey.D.Luffy", () => {
  test("uses Rush, trashes a hand card, returns either owner's Character, then gives rested DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op11MonkeyDLuffy118, eb01Fourtricks025, eb01MountainGod018],
        character: [eb01Doma005],
        activeDon: op11MonkeyDLuffy118.cost,
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const ownTargetId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    const paymentId = engine.findCardInZone("south", "hand", eb01Fourtricks025);

    engine.playCard(op11MonkeyDLuffy118, "south");
    const luffyId = engine.findCardInZone("south", "character", op11MonkeyDLuffy118);
    engine.declareAttack(luffyId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");

    const returned = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (returned?.kind !== "selectEntity") throw new Error("Expected Luffy's return target.");
    expect(returned.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownTargetId, opposingTargetId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownTargetId] }, "south");

    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(count?.kind).toBe("chooseOption");
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(ownTargetId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.south.leader.attachedDon).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op11MonkeyDLuffy118, eb01Fourtricks025, eb01MountainGod018],
        character: [eb01Doma005],
        activeDon: op11MonkeyDLuffy118.cost,
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.playCard(op11MonkeyDLuffy118, "south");
    const luffyId = engine.findCardInZone("south", "character", op11MonkeyDLuffy118);
    engine.declareAttack(luffyId, engine.leader("north"), "south");

    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
