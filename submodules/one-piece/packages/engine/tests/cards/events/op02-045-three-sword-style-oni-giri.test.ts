import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op01KinEmon040,
  op01Marco023,
  op01Sanji013,
  op02ThreeSwordStyleOniGiri045,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP02-045 Three Sword Style Oni Giri", () => {
  test("maps Counter power and permits only a cost-3-or-less Character with no base effect", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op02ThreeSwordStyleOniGiri045, op01Marco023, op01Sanji013],
        activeDon: 3,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op02ThreeSwordStyleOniGiri045);
    const vanillaId = engine.findCardInZone("north", "hand", op01Marco023);
    const effectCharacterId = engine.findCardInZone("north", "hand", op01Sanji013);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const playDecision = engine.pendingDecision("effectPlaySelection", "north");
    const playStep = playDecision.steps[0];
    expect(playStep?.kind).toBe("selectEntity");
    if (playStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to choose a no-effect Character to play.");
    }
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).toEqual([vanillaId]);
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      effectCharacterId,
    );
    engine.resolveDecision("effectPlaySelection", { selectedIds: [vanillaId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.players.north.characters.some((card) => card?.instanceId === vanillaId)).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("maps the Life Trigger to the opponent's cost-5-or-less Leader or Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op01KinEmon040, playedOnTurn: 0 },
        ],
      },
      {
        life: [op02ThreeSwordStyleOniGiri045],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const cost5Id = engine.findCardInZone("south", "character", eb01MountainGod018);
    const cost6Id = engine.findCardInZone("south", "character", op01KinEmon040);
    const targetLeaderId = engine.leader("south");

    engine.declareAttack(cost5Id, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const restDecision = engine.pendingDecision("effectTargetSelection", "north");
    const restStep = restDecision.steps[0];
    expect(restStep?.kind).toBe("selectEntity");
    if (restStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose an opposing card to rest.");
    }
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).toContain(targetLeaderId);
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(cost5Id);
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(cost6Id);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetLeaderId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.leader.rested).toBe(true);
    expect(view.players.south.characters.find((card) => card?.instanceId === cost6Id)?.rested).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
