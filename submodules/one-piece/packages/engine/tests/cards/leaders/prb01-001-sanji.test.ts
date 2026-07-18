import { describe, expect, test } from "vite-plus/test";
import {
  op06RoronoaZoro118,
  op14eb04Diamante066,
  op14eb04Shirahoshi047,
  prb01SanjiPrb01001001,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("PRB01-001 Sanji", () => {
  test("maps the no-On-Play cost boundary and grants Rush for a same-turn attack", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: prb01SanjiPrb01001001,
        hand: [op14eb04Diamante066],
        character: [op14eb04Shirahoshi047, op06RoronoaZoro118],
        activeDon: 6,
      },
      { life: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op14eb04Diamante066, "south");
    const recipientId = engine.findCardInZone("south", "character", op14eb04Diamante066);
    const onPlayId = engine.findCardInZone("south", "character", op14eb04Shirahoshi047);
    const costNineId = engine.findCardInZone("south", "character", op06RoronoaZoro118);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    const selection = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(selection?.kind).toBe("selectEntity");
    if (selection?.kind !== "selectEntity") throw new Error("Expected Sanji's Rush recipient.");
    expect(selection.candidates.map((candidate) => candidate.ref.id)).toEqual([recipientId]);
    expect(selection.candidates.map((candidate) => candidate.ref.id)).not.toContain(onPlayId);
    expect(selection.candidates.map((candidate) => candidate.ref.id)).not.toContain(costNineId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recipientId] }, "south");

    engine.declareAttack(recipientId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === recipientId)?.rested,
    ).toBe(true);
    expect(view.players.north.lifeCount).toBe(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
