import { eb01Doma005 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04RoronoaZoroOp14015015 } from "../../../../../cards/src/cards/OP14EB04/characters/015-roronoa-zoro-op14-015.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-015 Roronoa Zoro", () => {
  test("uses Rush and gives one selected opposing Character minus 1000 power for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04RoronoaZoroOp14015015],
        activeDon: op14eb04RoronoaZoroOp14015015.cost,
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op14eb04RoronoaZoroOp14015015, "south");
    const zoroId = engine.findCardInZone("south", "character", op14eb04RoronoaZoroOp14015015);
    engine.declareAttack(zoroId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Zoro's power target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      (eb01Doma005.power ?? 0) - 1000,
    );
    expect(view.players.south.characters.find((card) => card?.instanceId === zoroId)?.rested).toBe(
      true,
    );
    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      eb01Doma005.power,
    );
  });
});
