import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op12BrochetteBlow078 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP12-078 Brochette Blow", () => {
  test("Main draws at the DON!! field boundary and gives an opposing Character -3000 power", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op12BrochetteBlow078],
        deck: [eb01Doma005],
        activeDon: 3,
      },
      {
        character: [eb01MountainGod018],
        activeDon: 3,
      },
    );
    const drawId = engine.findCardInZone("south", "deck", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const powerBefore = engine
      .getView("south")
      .players.north.characters.find((card) => card?.instanceId === targetId)?.power;
    if (powerBefore == null) throw new Error("Expected the opposing Character power.");

    engine.playCard(op12BrochetteBlow078);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      drawId,
    );
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(powerBefore - 3000);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
