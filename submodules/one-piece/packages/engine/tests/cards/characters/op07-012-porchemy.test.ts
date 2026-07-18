import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op07Porchemy012 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-012 Porchemy", () => {
  test("gives a selected opposing Character -1000 power for this turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op07Porchemy012], activeDon: op07Porchemy012.cost },
      { character: [eb01Doma005, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const otherId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op07Porchemy012, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Porchemy's power target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([targetId, otherId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      6000,
    );
    expect(view.players.north.characters.find((card) => card?.instanceId === otherId)?.power).toBe(
      3000,
    );

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      7000,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may choose no opposing Character on play", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op07Porchemy012], activeDon: op07Porchemy012.cost },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op07Porchemy012, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      3000,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
