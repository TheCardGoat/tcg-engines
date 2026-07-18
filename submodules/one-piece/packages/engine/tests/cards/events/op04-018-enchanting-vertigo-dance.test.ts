import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op04EnchantingVertigoDance018,
  op04NefeltariVivi001,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

function characterPower(engine: OnePieceTestEngine, viewer: "south" | "north", instanceId: string) {
  const opponent = viewer === "south" ? "north" : "south";
  const power = engine
    .getView(viewer)
    .players[opponent].characters.find((card) => card?.instanceId === instanceId)?.power;
  if (power === undefined || power === null) {
    throw new Error("Expected the opposing Character to expose its current power.");
  }
  return power;
}

describe("OP04-018 Enchanting Vertigo Dance", () => {
  test("with an Alabasta Leader, maps up to two opposing recipients and turn expiration", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04NefeltariVivi001,
        hand: [op04EnchantingVertigoDance018],
        activeDon: 3,
      },
      {
        character: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
    );
    const firstId = engine.findCardInZone("north", "character", eb01Doma005);
    const secondId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const unselectedId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const firstPower = characterPower(engine, "south", firstId);
    const secondPower = characterPower(engine, "south", secondId);
    const unselectedPower = characterPower(engine, "south", unselectedId);

    engine.playCard(op04EnchantingVertigoDance018);

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to choose up to two opposing Characters.");
    }
    expect(targetStep).toMatchObject({ min: 0, max: 2 });
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstId,
      secondId,
      unselectedId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [firstId, secondId] }, "south");

    expect(characterPower(engine, "south", firstId)).toBe(firstPower - 2000);
    expect(characterPower(engine, "south", secondId)).toBe(secondPower - 2000);
    expect(characterPower(engine, "south", unselectedId)).toBe(unselectedPower);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);

    engine.endTurn("south");
    expect(characterPower(engine, "south", firstId)).toBe(firstPower);
    expect(characterPower(engine, "south", secondId)).toBe(secondPower);
  });

  test("Life Trigger activates Main without Event payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        leaderCardId: op04NefeltariVivi001,
        life: [op04EnchantingVertigoDance018],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const powerBefore = characterPower(engine, "north", attackerId);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [attackerId] }, "north");

    const view = engine.getView("north");
    expect(characterPower(engine, "north", attackerId)).toBe(powerBefore - 2000);
    expect(view.players.north).toMatchObject({ activeDon: 0, restedDon: 0 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
