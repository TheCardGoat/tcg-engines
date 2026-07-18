import { describe, expect, test } from "vite-plus/test";
import { eb01Fourtricks025, eb01MountainGod018, op04HappinessPunch017 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

function opposingCharacterPower(engine: OnePieceTestEngine, instanceId: string) {
  const power = engine
    .getView("north")
    .players.south.characters.find((card) => card?.instanceId === instanceId)?.power;
  if (power === undefined || power === null) {
    throw new Error("Expected the opposing Character to expose its current power.");
  }
  return power;
}

describe("OP04-017 Happiness Punch", () => {
  test("with an active Leader, may give the same opposing card a total of -3000 power", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Fourtricks025, playedOnTurn: 0 },
        ],
      },
      {
        hand: [op04HappinessPunch017],
        activeDon: 1,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const secondId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const eventId = engine.findCardInZone("north", "hand", op04HappinessPunch017);
    const attackerPower = opposingCharacterPower(engine, attackerId);
    const secondPower = opposingCharacterPower(engine, secondId);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const firstDecision = engine.pendingDecision("effectTargetSelection", "north");
    const firstStep = firstDecision.steps[0];
    expect(firstStep?.kind).toBe("selectEntity");
    if (firstStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to choose the -2000 opposing recipient.");
    }
    expect(firstStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      attackerId,
      secondId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [attackerId] }, "north");

    const secondDecision = engine.pendingDecision("effectTargetSelection", "north");
    const secondStep = secondDecision.steps[0];
    expect(secondStep?.kind).toBe("selectEntity");
    if (secondStep?.kind !== "selectEntity") {
      throw new Error("Expected the active-Leader condition to publish the -1000 choice.");
    }
    expect(secondStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      attackerId,
      secondId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [attackerId] }, "north");

    expect(opposingCharacterPower(engine, attackerId)).toBe(attackerPower - 3000);
    expect(opposingCharacterPower(engine, secondId)).toBe(secondPower);
    expect(engine.getView("north").players.north).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);

    engine.endTurn("south");
    expect(opposingCharacterPower(engine, attackerId)).toBe(attackerPower);
    expect(opposingCharacterPower(engine, secondId)).toBe(secondPower);
  });
});
