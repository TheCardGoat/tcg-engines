import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb02FakeStrawHatCrew005,
  eb03Baccarat007,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-007 Baccarat", () => {
  test("blocks, then plays only an effectless power-6000-or-less Character after being K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [eb03Baccarat007],
        hand: [eb01Doma005, eb02FakeStrawHatCrew005, eb01MountainGod018],
      },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const baccaratId = engine.findCardInZone("south", "character", eb03Baccarat007);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const vanillaId = engine.findCardInZone("south", "hand", eb01Doma005);
    const effectfulId = engine.findCardInZone("south", "hand", eb02FakeStrawHatCrew005);
    const tooPowerfulId = engine.findCardInZone("south", "hand", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Baccarat's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", baccaratId]);
    engine.resolveDecision("battleBlocker", { selectedIds: [baccaratId] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity")
      throw new Error("Expected Baccarat's effectless play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([vanillaId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(effectfulId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooPowerfulId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [vanillaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(baccaratId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(vanillaId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
