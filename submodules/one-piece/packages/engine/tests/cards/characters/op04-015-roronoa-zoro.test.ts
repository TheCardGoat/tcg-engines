import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op04RoronoaZoro015 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-015 Roronoa Zoro", () => {
  test("on play gives a selected opposing Character -2000 power for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op04RoronoaZoro015],
        activeDon: op04RoronoaZoro015.cost,
      },
      {
        character: [{ card: eb01Doma005, playedOnTurn: 0 }],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op04RoronoaZoro015, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      1000,
    );

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      3000,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may give no opposing Character the power reduction", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op04RoronoaZoro015],
        activeDon: op04RoronoaZoro015.cost,
      },
      {
        character: [{ card: eb01Doma005, playedOnTurn: 0 }],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op04RoronoaZoro015, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      3000,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
