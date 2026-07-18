import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op05Hack012,
  op05Sabo007,
  op06GumGumKingKongGatling018,
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

function setPowerModifier(engine: OnePieceTestEngine, targetId: string, value: number, id: string) {
  engine.getState().modifiers[id] = {
    id,
    sourceInstanceId: null,
    targetId,
    type: "power",
    value,
    duration: "thisTurn",
    expiresAtTurn: null,
    expiresAtBattleId: null,
    expiresOnTurnStartOfSeat: null,
  };
}

describe("OP06-018 Gum-Gum King Kong Gatling", () => {
  test("Main maps an independent second power recipient when the opponent has 7000 power", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06GumGumKingKongGatling018],
        character: [eb01Doma005],
        activeDon: 2,
      },
      {
        character: [op05Sabo007],
      },
    );
    const characterId = engine.findCardInZone("south", "character", eb01Doma005);
    const leaderBefore = leaderPower(engine, "south");
    const characterBefore = engine.getView("south").players.south.characters[0]?.power ?? 0;

    engine.playCard(op06GumGumKingKongGatling018);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    const secondDecision = engine.pendingDecision("effectTargetSelection", "south");
    const secondStep = secondDecision.steps[0];
    expect(secondStep?.kind).toBe("selectEntity");
    if (secondStep?.kind !== "selectEntity") {
      throw new Error("Expected an independent recipient for the conditional +1000.");
    }
    expect(secondStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      characterId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [characterId] }, "south");

    expect(leaderPower(engine, "south")).toBe(leaderBefore + 3000);
    expect(engine.getView("south").players.south.characters[0]?.power).toBe(characterBefore + 1000);
    expect(engine.getView("south").prompts).toHaveLength(0);

    engine.endTurn("south");
    expect(leaderPower(engine, "south")).toBe(leaderBefore);
    expect(engine.getView("south").players.south.characters[0]?.power).toBe(characterBefore);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("the independent conditional recipient remains available after skipping the first up-to target", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06GumGumKingKongGatling018],
        character: [eb01Doma005],
        activeDon: 2,
      },
      {
        character: [op05Sabo007],
      },
    );
    const characterId = engine.findCardInZone("south", "character", eb01Doma005);
    const characterBefore = engine.getView("south").players.south.characters[0]?.power ?? 0;

    engine.playCard(op06GumGumKingKongGatling018);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const secondDecision = engine.pendingDecision("effectTargetSelection", "south");
    const secondStep = secondDecision.steps[0];
    expect(secondStep?.kind).toBe("selectEntity");
    if (secondStep?.kind !== "selectEntity") {
      throw new Error("Expected the conditional recipient after skipping the first target.");
    }
    expect(secondStep.candidates.map((candidate) => candidate.ref.id)).toContain(characterId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [characterId] }, "south");

    expect(engine.getView("south").players.south.characters[0]?.power).toBe(characterBefore + 1000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("the conditional +1000 does not resolve below the effective 7000-power threshold", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06GumGumKingKongGatling018],
        character: [eb01Doma005],
        activeDon: 2,
      },
      {
        character: [op05Sabo007],
      },
    );
    const opponentId = engine.findCardInZone("north", "character", op05Sabo007);
    setPowerModifier(engine, opponentId, -1, "op06-018-below-threshold");

    engine.playCard(op06GumGumKingKongGatling018);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getView("south").players.north.characters[0]?.power).toBe(6999);
  });

  test("Life Trigger K.O.s the opposing effective power-5000 boundary without Main payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, op05Hack012, op05Sabo007],
      },
      {
        life: [op06GumGumKingKongGatling018],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedId = engine.findCardInZone("south", "character", op05Hack012);
    const excludedId = engine.findCardInZone("south", "character", op05Sabo007);
    setPowerModifier(engine, selectedId, 1, "op06-018-above-trigger-threshold");
    setPowerModifier(engine, excludedId, -2000, "op06-018-at-trigger-threshold");

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const koDecision = engine.pendingDecision("effectTargetSelection", "north");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose an opposing power-5000 Character.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([excludedId]);
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(selectedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [excludedId] }, "north");

    expect(engine.getView("north").players.south.trash.map((card) => card.instanceId)).toContain(
      excludedId,
    );
    expect(engine.getView("north").players.north.activeDon).toBe(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
