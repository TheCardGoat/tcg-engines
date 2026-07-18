import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op08BaronTamago070, op08ViscountHiyoko073 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-070 Baron Tamago", () => {
  test("blocks, then returns 1 DON!! to play Viscount Hiyoko from hand when K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op08BaronTamago070],
        hand: [op08ViscountHiyoko073],
        activeDon: 1,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const tamagoId = engine.findCardInZone("south", "character", op08BaronTamago070);
    const hiyokoId = engine.findCardInZone("south", "hand", op08ViscountHiyoko073);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [tamagoId] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Tamago's Viscount Hiyoko choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([hiyokoId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [hiyokoId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(tamagoId);
    expect(view.players.south.characters.some((card) => card?.instanceId === hiyokoId)).toBe(true);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });
});
