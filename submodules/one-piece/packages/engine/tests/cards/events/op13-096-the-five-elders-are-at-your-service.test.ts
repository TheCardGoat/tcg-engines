import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op13SaintJalmac085,
  op13TheFiveEldersAreAtYourService096,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP13-096 The Five Elders Are at Your Service!!!", () => {
  test("Main finds a Celestial Dragons card other than itself and trashes the rest", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13TheFiveEldersAreAtYourService096],
      deck: [op13SaintJalmac085, op13TheFiveEldersAreAtYourService096, eb01Doma005],
      activeDon: 1,
    });
    const selectedId = engine.findCardInZone("south", "deck", op13SaintJalmac085);
    const excludedId = engine.findCardInZone("south", "deck", op13TheFiveEldersAreAtYourService096);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op13TheFiveEldersAreAtYourService096);
    const decision = engine.pendingDecision("effectSearchSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected a private search choice.");
    expect(step.candidates.find((candidate) => candidate.ref.id === selectedId)?.legal).toBe(true);
    expect(step.candidates.find((candidate) => candidate.ref.id === excludedId)?.legal).toBe(false);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(selectedId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([excludedId, unrelatedId]),
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger activates Main without paying the Event cost", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op13TheFiveEldersAreAtYourService096],
        deck: [op13SaintJalmac085, eb01Doma005, eb01MountainGod018],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedId = engine.findCardInZone("north", "deck", op13SaintJalmac085);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(selectedId);
    expect(view.players.north.activeDon).toBe(0);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
