import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op04GunModoki115,
  op04HeavenlyFire117,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP04-117 Heavenly Fire", () => {
  test("Main lets its controller place an opposing cost-3-or-less Character at bottom Life face-up", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op04HeavenlyFire117],
        activeDon: 1,
      },
      {
        life: [eb01MountainGod018, eb01Fourtricks025],
        character: [eb01Doma005, eb01MountainGod018],
      },
    );
    const selectedId = engine.findCardInZone("north", "character", eb01Doma005);
    const excludedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op04HeavenlyFire117);

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected an opposing low-cost Character choice.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    const positionDecision = engine.pendingDecision("effectLifePosition", "south");
    const positionStep = positionDecision.steps[0];
    expect(positionStep?.kind).toBe("chooseOption");
    if (positionStep?.kind !== "chooseOption") {
      throw new Error("Expected the controller to choose top or bottom of opposing Life.");
    }
    expect(positionStep.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectLifePosition", { optionId: "bottom" }, "south");

    expect(engine.getState().players.north.life.at(-1)).toBe(selectedId);
    expect(engine.getState().cards[selectedId]?.faceUp).toBe(true);
    expect(engine.getView("south").players.north.lifeCount).toBe(3);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger privately pays from bottom Life before choosing a hand card for top Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op04GunModoki115],
        life: [op04HeavenlyFire117, eb01Doma005, eb01Fourtricks025],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const handCardId = engine.findCardInZone("north", "hand", op04GunModoki115);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const bottomLifeId = engine.getState().players.north.life.at(-1)!;
    const costDecision = engine.pendingDecision("effectCostAddLifeToHand", "north");
    const costStep = costDecision.steps[0];
    expect(costStep?.kind).toBe("chooseOption");
    if (costStep?.kind !== "chooseOption") {
      throw new Error("Expected a private top-or-bottom Life cost choice.");
    }
    expect(costStep.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    expect(JSON.stringify(engine.getView("south").decisions)).not.toContain(eb01Fourtricks025.name);
    engine.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "north");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "north");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose a card from hand for top Life.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toContain(handCardId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [handCardId] }, "north");

    expect(engine.getState().players.north.life[0]).toBe(handCardId);
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      bottomLifeId,
    );
    expect(engine.getView("north").players.north.lifeCount).toBe(2);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
