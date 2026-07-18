import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op07Kalifa081 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-081 Kalifa", () => {
  test("with DON!! x1 on its controller's turn, reduces every opposing Character's cost", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07Kalifa081], activeDon: 1 },
      { character: [eb01Doma005, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kalifaId = engine.findCardInZone("south", "character", op07Kalifa081);
    const lowCostId = engine.findCardInZone("north", "character", eb01Doma005);
    const highCostId = engine.findCardInZone("north", "character", eb01MountainGod018);

    let view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === lowCostId)?.cost).toBe(
      1,
    );
    expect(
      view.players.north.characters.find((card) => card?.instanceId === highCostId)?.cost,
    ).toBe(5);

    engine.attachDon(kalifaId, 1, "south");
    view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === lowCostId)?.cost).toBe(
      0,
    );
    expect(
      view.players.north.characters.find((card) => card?.instanceId === highCostId)?.cost,
    ).toBe(4);
    expect(view.players.south.characters.find((card) => card?.instanceId === kalifaId)?.cost).toBe(
      op07Kalifa081.cost,
    );

    engine.endTurn("south");
    view = engine.getView("north");
    expect(view.players.north.characters.find((card) => card?.instanceId === lowCostId)?.cost).toBe(
      1,
    );
    expect(
      view.players.north.characters.find((card) => card?.instanceId === highCostId)?.cost,
    ).toBe(5);
  });
});
