import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb01ScratchmenApoo015,
  op01Otama006,
  op07Ain002,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-002 Ain", () => {
  test("sets one opposing Character's power to 0 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op07Ain002], activeDon: op07Ain002.cost },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const otherId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const otherPower = engine
      .getView("south")
      .players.north.characters.find((card) => card?.instanceId === otherId)?.power;

    engine.playCard(op07Ain002, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Ain's power target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([targetId, otherId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      0,
    );
    expect(view.players.north.characters.find((card) => card?.instanceId === otherId)?.power).toBe(
      otherPower,
    );

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      eb01Doma005.power,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("does not raise a Character whose current power is already negative", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op01Otama006, op07Ain002], activeDon: op01Otama006.cost + op07Ain002.cost },
      { character: [eb01ScratchmenApoo015] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01ScratchmenApoo015);

    engine.playCard(op01Otama006, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(-1000);

    engine.playCard(op07Ain002, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(-1000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
