import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { op11MonkeyDLuffy118 } from "../../../../../cards/src/cards/OP11/characters/118-monkey-d-luffy.ts";

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
});
