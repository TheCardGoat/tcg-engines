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
});
