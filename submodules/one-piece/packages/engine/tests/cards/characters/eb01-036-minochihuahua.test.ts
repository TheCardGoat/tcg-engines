import { describe, expect, test } from "vite-plus/test";
import { eb01Minochihuahua036, eb01MountainGod018, op02EmporioIvankov049 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-036 Minochihuahua", () => {
  test("uses Rush immediately, then adds a rested DON!! when battle K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02EmporioIvankov049,
        hand: [eb01Minochihuahua036],
        activeDon: 4,
        donDeckCount: 1,
      },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        hand: [eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const opponentAttackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(eb01Minochihuahua036);
    const minochihuahuaId = engine.findCardInZone("south", "character", eb01Minochihuahua036);

    engine.declareAttack(minochihuahuaId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.endTurn("south");
    const restedDonBefore = engine.getView("south").players.south.restedDon;
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.declareAttack(opponentAttackerId, minochihuahuaId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") {
      throw new Error("Expected Minochihuahua's rested DON!! choice after K.O.");
    }
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(minochihuahuaId);
    expect(view.players.south.restedDon).toBe(restedDonBefore + 1);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore - 1);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
