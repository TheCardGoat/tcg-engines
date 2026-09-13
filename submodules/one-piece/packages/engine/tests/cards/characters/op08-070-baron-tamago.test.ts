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

  test("may decline optional so paid effect does not apply", () => {
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
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [tamagoId] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
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
