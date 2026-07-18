import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op05GammaKnife077, op05Pell014 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP05-077 Gamma Knife", () => {
  test("Main returns a player-selected DON!! before applying its turn-scoped power reduction", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op05GammaKnife077],
        activeDon: 3,
      },
      {
        character: [op05Pell014],
      },
    );
    const targetId = engine.findCardInZone("north", "character", op05Pell014);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op05GammaKnife077);

    const costDecision = engine.pendingDecision("effectCostReturnDon", "south");
    const costStep = costDecision.steps[0];
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected the controller to choose the DON!! -1 source.");
    }
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).toContain("active-don:0");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const character = engine
      .getView("south")
      .players.north.characters.find((card) => card?.instanceId === targetId);
    expect(character?.power).toBe(-1000);
    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 0,
      restedDon: 2,
      donDeckCount: donDeckBefore + 1,
    });
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger adds an optional DON!! active without the Main return cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op05GammaKnife077],
        donDeckCount: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const donDecision = engine.pendingDecision("effectAddDon", "north");
    expect(donDecision.steps[0]).toMatchObject({
      kind: "chooseOption",
      options: [
        { id: "0", value: "0" },
        { id: "1", value: "1" },
      ],
    });
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "north");

    expect(engine.getView("north").players.north).toMatchObject({
      activeDon: 1,
      restedDon: 0,
      donDeckCount: 0,
    });
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
