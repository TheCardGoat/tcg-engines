import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01EustassCaptainKid051,
  op01Hajrudin018,
  op01King096,
  op01Urashima092,
  op03FlameEmperor016,
  op03PortgasDAce001,
  op02VenomRoad091,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP03-016 Flame Emperor", () => {
  test("with Ace, K.O.s the power-8000 boundary and gives the Leader +3000 and Double Attack", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03PortgasDAce001,
        hand: [op03FlameEmperor016],
        activeDon: 7,
      },
      {
        character: [op01EustassCaptainKid051, op01Urashima092],
        life: [op02VenomRoad091, eb01Doma005, eb01Fourtricks025],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const eligibleId = engine.findCardInZone("north", "character", op01EustassCaptainKid051);
    const excludedId = engine.findCardInZone("north", "character", op01Urashima092);
    const leaderPowerBefore = engine.getView("south").players.south.leader.power;
    if (leaderPowerBefore === null) {
      throw new Error("Expected Ace to expose his current power.");
    }

    engine.playCard(op03FlameEmperor016);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    let view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.some((card) => card?.instanceId === excludedId)).toBe(
      true,
    );
    expect(view.players.south.leader.power).toBe(leaderPowerBefore + 3000);

    const lifeBefore = view.players.north.lifeCount;
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    view = engine.getView("south");
    expect(view.players.north.lifeCount).toBe(lifeBefore - 2);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);

    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader.power).toBe(leaderPowerBefore);
  });

  test("still gives Ace +3000 and Double Attack when no K.O. target is chosen", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03PortgasDAce001,
        hand: [op03FlameEmperor016],
        activeDon: 7,
      },
      {
        character: [op01EustassCaptainKid051],
        life: [op02VenomRoad091, eb01Doma005, eb01Fourtricks025],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const eligibleId = engine.findCardInZone("north", "character", op01EustassCaptainKid051);
    const leaderPowerBefore = engine.getView("south").players.south.leader.power;
    if (leaderPowerBefore === null) {
      throw new Error("Expected Ace to expose his current power.");
    }

    engine.playCard(op03FlameEmperor016);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    let view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === eligibleId)).toBe(
      true,
    );
    expect(view.players.south.leader.power).toBe(leaderPowerBefore + 3000);

    const lifeBefore = view.players.north.lifeCount;
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    view = engine.getView("south");
    expect(view.players.north.lifeCount).toBe(lifeBefore - 2);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger K.O.s only an opposing Character at the power-6000 boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op01Hajrudin018, playedOnTurn: 0 },
          { card: op01King096, playedOnTurn: 0 },
        ],
      },
      {
        life: [op03FlameEmperor016],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const boundaryId = engine.findCardInZone("south", "character", op01Hajrudin018);
    const excludedId = engine.findCardInZone("south", "character", op01King096);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const koDecision = engine.pendingDecision("effectTargetSelection", "north");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose an opposing Character.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toContain(boundaryId);
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [boundaryId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(boundaryId);
    expect(view.players.south.characters.some((card) => card?.instanceId === excludedId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
