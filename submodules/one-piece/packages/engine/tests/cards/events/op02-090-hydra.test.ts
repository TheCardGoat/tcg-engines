import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op02Hydra090 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP02-090 Hydra", () => {
  test("pays DON!! -1 and maps the opposing Character power choice through turn end", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op02Hydra090],
        activeDon: 2,
      },
      {
        character: [eb01Doma005, eb01MountainGod018],
      },
    );
    const selectedId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const otherId = engine.findCardInZone("north", "character", eb01Doma005);
    const selectedPowerBefore = engine
      .getView("south")
      .players.north.characters.find((card) => card?.instanceId === selectedId)?.power;
    if (selectedPowerBefore === undefined || selectedPowerBefore === null) {
      throw new Error("Expected the opposing Character to expose its current power.");
    }
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op02Hydra090);
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const powerDecision = engine.pendingDecision("effectTargetSelection", "south");
    const powerStep = powerDecision.steps[0];
    expect(powerStep?.kind).toBe("selectEntity");
    if (powerStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to choose an opposing Character.");
    }
    expect(powerStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      otherId,
      selectedId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === selectedId)?.power,
    ).toBe(selectedPowerBefore - 3000);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);

    engine.endTurn("south");
    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === selectedId)?.power,
    ).toBe(selectedPowerBefore);
  });

  test("at 6 opposing DON!!, Life Trigger returns one from the opponent's only source group", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        activeDon: 6,
      },
      {
        life: [op02Hydra090],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const before = engine.getView("south").players.south;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({
      activeDon: before.activeDon - 1,
      donDeckCount: before.donDeckCount + 1,
    });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
