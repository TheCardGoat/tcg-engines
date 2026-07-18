import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op06Cerberus087, op06Oars083 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-083 Oars", () => {
  test("cannot attack until it K.O.s a Thriller Bark Pirates Character to negate itself", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op06Oars083, playedOnTurn: 0 }, op06Cerberus087, eb01Doma005],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const oarsId = engine.findCardInZone("south", "character", op06Oars083);
    const thrillerBarkId = engine.findCardInZone("south", "character", op06Cerberus087);
    const nonThrillerBarkId = engine.findCardInZone("south", "character", eb01Doma005);

    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: oarsId,
        targetId: engine.leader("north"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");

    engine.activateEffect(oarsId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostKoCharacter", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Oars's Character K.O. cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([oarsId, thrillerBarkId]),
    );
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonThrillerBarkId);
    engine.resolveDecision("effectCostKoCharacter", { selectedIds: [thrillerBarkId] }, "south");

    engine.declareAttack(oarsId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(thrillerBarkId);
    expect(view.players.south.characters.find((card) => card?.instanceId === oarsId)?.rested).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
