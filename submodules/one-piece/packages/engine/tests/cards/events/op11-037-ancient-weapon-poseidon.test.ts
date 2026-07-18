import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op11Aladine024,
  op11AncientWeaponPoseidon037,
  op11BirdNeptunian033,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP11-037 Ancient Weapon Poseidon", () => {
  test("Main searches either included type while still requiring a Character and orders the remainder", () => {
    const deck = [op11Aladine024, op11BirdNeptunian033, op11AncientWeaponPoseidon037, eb01Doma005];
    const engine = OnePieceTestEngine.create({
      hand: [op11AncientWeaponPoseidon037],
      deck,
      activeDon: 1,
    });
    const selectedId = engine.findCardInZone("south", "deck", op11Aladine024);
    const alternateId = engine.findCardInZone("south", "deck", op11BirdNeptunian033);
    const eventId = engine.findCardInZone("south", "deck", op11AncientWeaponPoseidon037);
    const revealedIds = engine.getState().players.south.deck.slice(0, 4);

    engine.playCard(op11AncientWeaponPoseidon037);
    const decision = engine.pendingDecision("effectSearchSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity")
      throw new Error("Expected a private alternative-type search.");
    expect(step.candidates.find((candidate) => candidate.ref.id === selectedId)?.legal).toBe(true);
    expect(step.candidates.find((candidate) => candidate.ref.id === alternateId)?.legal).toBe(true);
    expect(step.candidates.find((candidate) => candidate.ref.id === eventId)?.legal).toBe(false);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: revealedIds.filter((id) => id !== selectedId).reverse() },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws one without paying the Main cost", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op11AncientWeaponPoseidon037],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005, eb01MountainGod018],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const drawId = engine.findCardInZone("north", "deck", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      drawId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
