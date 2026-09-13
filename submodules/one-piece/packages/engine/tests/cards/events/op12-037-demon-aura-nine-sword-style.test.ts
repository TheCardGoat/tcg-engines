import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op12DemonAuraNineSwordStyleAsuraBladesDrawnDeadManSGame037,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP12-037 Demon Aura Nine Sword Style Asura Blades Drawn Dead Man's Game", () => {
  test("Main pays the optional 3-DON!! cost and maps one mixed Character-or-DON!! choice", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op12DemonAuraNineSwordStyleAsuraBladesDrawnDeadManSGame037],
        activeDon: 4,
      },
      { character: [eb01Doma005], activeDon: 1 },
    );
    const characterId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op12DemonAuraNineSwordStyleAsuraBladesDrawnDeadManSGame037);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const step = engine.pendingDecision("effectMixedRestSelection", "south").steps[0];
    expect(step?.kind).toBe("payCost");
    if (step?.kind !== "payCost") throw new Error("Expected a Character-or-DON!! rest choice.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([
      characterId,
      "active-don:north:0",
    ]);
    expect(step.max).toBe(2);
    engine.resolveDecision("effectMixedRestSelection", { selectedIds: [characterId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 4 });
    expect(view.players.north).toMatchObject({ activeDon: 1, restedDon: 0 });
    expect(
      view.players.north.characters.find((card) => card?.instanceId === characterId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Counter gives the defending Leader +3000 for the battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        hand: [op12DemonAuraNineSwordStyleAsuraBladesDrawnDeadManSGame037],
        activeDon: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone(
      "north",
      "hand",
      op12DemonAuraNineSwordStyleAsuraBladesDrawnDeadManSGame037,
    );
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op12DemonAuraNineSwordStyleAsuraBladesDrawnDeadManSGame037],
        activeDon: 4,
      },
      { character: [eb01Doma005], activeDon: 1 },
    );
    engine.playCard(op12DemonAuraNineSwordStyleAsuraBladesDrawnDeadManSGame037, "south");
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
