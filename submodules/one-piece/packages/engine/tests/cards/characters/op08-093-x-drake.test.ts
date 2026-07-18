import { describe, expect, test } from "vite-plus/test";
import { op08XDrake093 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-093 X.Drake", () => {
  test("gains +2 cost while it has at least one DON!! attached", () => {
    const engine = OnePieceTestEngine.create(
      { activeDon: 1, character: [{ card: op08XDrake093, playedOnTurn: 0 }] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const drakeId = engine.findCardInZone("south", "character", op08XDrake093);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === drakeId)
        ?.cost,
    ).toBe(4);

    engine.attachDon(drakeId, 1, "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === drakeId)
        ?.cost,
    ).toBe(6);
    engine.endTurn("south");
    expect(
      engine.getView("north").players.south.characters.find((card) => card?.instanceId === drakeId)
        ?.cost,
    ).toBe(6);
    engine.endTurn("north");
    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === drakeId)?.cost).toBe(
      4,
    );
    expect(
      view.players.south.characters.find((card) => card?.instanceId === drakeId)?.attachedDon,
    ).toBe(0);
  });
});
