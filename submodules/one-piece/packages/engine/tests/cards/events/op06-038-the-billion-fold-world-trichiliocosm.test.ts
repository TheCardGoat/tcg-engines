import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01Hajrudin018,
  op05Sabo007,
  op06TheBillionFoldWorldTrichiliocosm038,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

function setCostModifier(engine: OnePieceTestEngine, targetId: string, value: number, id: string) {
  engine.getState().modifiers[id] = {
    id,
    sourceInstanceId: null,
    targetId,
    type: "cost",
    value,
    duration: "thisTurn",
    expiresAtTurn: null,
    expiresAtBattleId: null,
    expiresOnTurnStartOfSeat: null,
  };
}

describe("OP06-038 The Billion-fold World Trichiliocosm", () => {
  test("Counter payment becomes the eighth rested card before same-recipient additional power", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op05Sabo007, attachedDon: 1, playedOnTurn: 0 }],
      },
      {
        hand: [op06TheBillionFoldWorldTrichiliocosm038],
        activeDon: 1,
        restedDon: 7,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", op05Sabo007);
    const eventId = engine.findCardInZone("north", "hand", op06TheBillionFoldWorldTrichiliocosm038);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").players.north).toMatchObject({ activeDon: 0, restedDon: 8 });
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("rested Leader and Character count, but attached DON do not count toward eight", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op05Sabo007, attachedDon: 1, playedOnTurn: 0 }],
      },
      {
        hand: [op06TheBillionFoldWorldTrichiliocosm038],
        activeDon: 1,
        restedDon: 3,
        character: [{ card: eb01Doma005, rested: true, attachedDon: 3 }],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", op05Sabo007);
    const eventId = engine.findCardInZone("north", "hand", op06TheBillionFoldWorldTrichiliocosm038);
    const leaderId = engine.leader("north");
    engine.getState().cards[leaderId]!.rested = true;
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, leaderId, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [leaderId] }, "north");

    expect(engine.getView("north").players.north).toMatchObject({ activeDon: 0, restedDon: 4 });
    expect(engine.getView("north").players.north.characters[0]?.attachedDon).toBe(3);
    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("skipping the first up-to recipient creates no phantom additional-power target", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op05Sabo007, playedOnTurn: 0 }],
      },
      {
        hand: [op06TheBillionFoldWorldTrichiliocosm038],
        activeDon: 1,
        restedDon: 7,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", op05Sabo007);
    const eventId = engine.findCardInZone("north", "hand", op06TheBillionFoldWorldTrichiliocosm038);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");

    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("Life Trigger K.O.s only an opposing rested effective cost-3 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, rested: true },
          { card: op01Hajrudin018, rested: true },
        ],
      },
      {
        life: [op06TheBillionFoldWorldTrichiliocosm038],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedId = engine.findCardInZone("south", "character", eb01Doma005);
    const excludedId = engine.findCardInZone("south", "character", op01Hajrudin018);
    setCostModifier(engine, selectedId, 3, "op06-038-above-trigger-threshold");
    setCostModifier(engine, excludedId, -1, "op06-038-at-trigger-threshold");

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const koDecision = engine.pendingDecision("effectTargetSelection", "north");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected the rested cost-3 Trigger K.O. choice.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([excludedId]);
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(selectedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [excludedId] }, "north");

    expect(engine.getView("north").players.south.trash.map((card) => card.instanceId)).toContain(
      excludedId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
