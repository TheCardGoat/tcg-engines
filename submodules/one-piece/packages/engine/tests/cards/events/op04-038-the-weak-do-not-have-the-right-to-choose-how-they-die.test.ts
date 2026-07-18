import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op03RobLucci092,
  op04NefeltariVivi118,
  op04TheWeakDoNotHaveTheRightToChooseHowTheyDie038,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP04-038 The Weak Do Not Have the Right to Choose How They Die!!!", () => {
  test("Main rests an opposing cost-6 Character before making it the K.O. choice", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op04TheWeakDoNotHaveTheRightToChooseHowTheyDie038],
        activeDon: 5,
      },
      {
        character: [op03RobLucci092, op04NefeltariVivi118],
      },
    );
    const selectedId = engine.findCardInZone("north", "character", op03RobLucci092);
    const tooExpensiveId = engine.findCardInZone("north", "character", op04NefeltariVivi118);

    engine.playCard(op04TheWeakDoNotHaveTheRightToChooseHowTheyDie038);

    const restDecision = engine.pendingDecision("effectTargetSelection", "south");
    const restStep = restDecision.steps[0];
    expect(restStep?.kind).toBe("selectEntity");
    if (restStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to choose an opposing Leader or Character to rest.");
    }
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("north"),
      selectedId,
      tooExpensiveId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    const koDecision = engine.pendingDecision("effectTargetSelection", "south");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected the newly rested cost-6 Character to become the K.O. choice.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(selectedId);
    expect(view.players.north.characters.some((card) => card?.instanceId === tooExpensiveId)).toBe(
      true,
    );
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 5 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Counter exposes the same ordered choices after Event payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
      {
        hand: [op04TheWeakDoNotHaveTheRightToChooseHowTheyDie038],
        activeDon: 5,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const otherId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone(
      "north",
      "hand",
      op04TheWeakDoNotHaveTheRightToChooseHowTheyDie038,
    );

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const restDecision = engine.pendingDecision("effectTargetSelection", "north");
    const restStep = restDecision.steps[0];
    expect(restStep?.kind).toBe("selectEntity");
    if (restStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to receive the Counter rest choice.");
    }
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      otherId,
    ]);
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [otherId] }, "north");

    const koDecision = engine.pendingDecision("effectTargetSelection", "north");
    expect(koDecision.steps[0]).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");

    const view = engine.getView("north");
    expect(view.players.north).toMatchObject({ activeDon: 0, restedDon: 5 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger maps the optional count for reactivating up to five DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op04TheWeakDoNotHaveTheRightToChooseHowTheyDie038],
        restedDon: 6,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const donDecision = engine.pendingDecision("effectSetActiveDon", "north");
    const donStep = donDecision.steps[0];
    expect(donStep?.kind).toBe("chooseOption");
    if (donStep?.kind !== "chooseOption") {
      throw new Error("Expected the damaged player to choose the reactivated DON!! count.");
    }
    expect(donStep.options.map((option) => option.id)).toEqual(["0", "1", "2", "3", "4", "5"]);
    engine.resolveDecision("effectSetActiveDon", { optionId: "5" }, "north");

    const view = engine.getView("north");
    expect(view.players.north).toMatchObject({ activeDon: 5, restedDon: 1 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
