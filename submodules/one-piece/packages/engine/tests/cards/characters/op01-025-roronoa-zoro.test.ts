import { describe, expect, test } from "vite-plus/test";
import { op01RoronoaZoro025 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-025 Roronoa Zoro", () => {
  test("uses Rush to attack on the turn it is played", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01RoronoaZoro025],
        activeDon: 3,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op01RoronoaZoro025, "south");
    const zoroId = engine.findCardInZone("south", "character", op01RoronoaZoro025);
    engine.declareAttack(zoroId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === zoroId)?.rested).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
