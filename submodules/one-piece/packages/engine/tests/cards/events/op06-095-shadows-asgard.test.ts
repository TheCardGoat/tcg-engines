import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op06Cerberus087,
  op06Kumacy085,
  op06ShadowsAsgard095,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

function leaderPower(engine: OnePieceTestEngine, seat: "south" | "north") {
  const power = engine.getView(seat).players[seat].leader.power;
  if (power === undefined || power === null) {
    throw new Error("Expected the Leader to expose its current power.");
  }
  return power;
}

function preventKoByEffect(engine: OnePieceTestEngine, targetId: string) {
  engine.getState().modifiers["op06-095-cannot-ko"] = {
    id: "op06-095-cannot-ko",
    sourceInstanceId: null,
    targetId,
    type: "flag",
    flag: "cannotBeKO",
    duration: "permanent",
    expiresAtTurn: null,
    expiresAtBattleId: null,
    expiresOnTurnStartOfSeat: null,
  };
}

describe("OP06-095 Shadows Asgard", () => {
  test("Main lets the controller K.O. any eligible Characters and scales Leader power by the chosen count", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06ShadowsAsgard095],
      character: [op06Kumacy085, op06Cerberus087, eb01Doma005],
      activeDon: 2,
    });
    const firstId = engine.findCardInZone("south", "character", op06Kumacy085);
    const secondId = engine.findCardInZone("south", "character", op06Cerberus087);
    const excludedId = engine.findCardInZone("south", "character", eb01Doma005);
    const powerBefore = leaderPower(engine, "south");

    engine.playCard(op06ShadowsAsgard095);

    const koDecision = engine.pendingDecision("effectTargetSelection", "south");
    const koStep = koDecision.steps[0];
    expect(koStep).toMatchObject({ kind: "selectEntity", min: 0, max: 2 });
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected any-number eligible Thriller Bark Pirates K.O. choice.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([firstId, secondId]);
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [firstId, secondId] }, "south");

    expect(leaderPower(engine, "south")).toBe(powerBefore + 3000);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstId, secondId]),
    );
    expect(
      engine
        .getView("south")
        .players.south.characters.some((card) => card?.instanceId === excludedId),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("choosing no Characters still grants only the initial +1000 until turn end", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06ShadowsAsgard095],
      character: [op06Kumacy085],
      activeDon: 2,
    });
    const powerBefore = leaderPower(engine, "south");

    engine.playCard(op06ShadowsAsgard095);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    expect(leaderPower(engine, "south")).toBe(powerBefore + 1000);
    engine.endTurn("south");
    expect(leaderPower(engine, "south")).toBe(powerBefore);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("excludes protected Characters and scales additional power by the eligible K.O.", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06ShadowsAsgard095],
      character: [op06Kumacy085, op06Cerberus087],
      activeDon: 2,
    });
    const protectedId = engine.findCardInZone("south", "character", op06Kumacy085);
    const koId = engine.findCardInZone("south", "character", op06Cerberus087);
    const powerBefore = leaderPower(engine, "south");
    preventKoByEffect(engine, protectedId);

    engine.playCard(op06ShadowsAsgard095);
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the K.O. target choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(koId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(protectedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [koId] }, "south");

    expect(engine.getState().cards[protectedId]?.zone).toBe("character");
    expect(engine.getState().cards[koId]?.zone).toBe("trash");
    expect(leaderPower(engine, "south")).toBe(powerBefore + 2000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Counter uses the same selected K.O. count before resolving combat", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01Doma005, attachedDon: 2, playedOnTurn: 0 }],
      },
      {
        hand: [op06ShadowsAsgard095],
        character: [op06Cerberus087],
        activeDon: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const eventId = engine.findCardInZone("north", "hand", op06ShadowsAsgard095);
    const koId = engine.findCardInZone("north", "character", op06Cerberus087);
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    const powerBefore = leaderPower(engine, "north");

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleBlocker", { selectedIds: [] }, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [koId] }, "north");

    expect(leaderPower(engine, "north")).toBe(powerBefore + 2000);
    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([eventId, koId]),
    );
    engine.endTurn("south");
    expect(leaderPower(engine, "north")).toBe(powerBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws 2 before the controller chooses the mandatory hand trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op06ShadowsAsgard095],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const firstDrawId = engine.findCardInZone("north", "deck", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [firstDrawId] }, "north");

    expect(engine.getView("north").players.north.hand).toHaveLength(1);
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      firstDrawId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
