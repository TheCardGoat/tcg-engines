import { describe, expect, test } from "vite-plus/test";
import {
  op08DrHiriluk016,
  op08DrumKingdom020,
  op08TonyTonyChopper007,
  op13Higuma013,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-020 Drum Kingdom", () => {
  test("dynamically gives exact and composite Drum Kingdom Characters +1000 during the opponent's turn", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op08DrumKingdom020],
      character: [op08DrHiriluk016, op08TonyTonyChopper007, op13Higuma013],
      activeDon: 1,
    });
    const exactTypeId = engine.findCardInZone("south", "character", op08DrHiriluk016);
    const compositeTypeId = engine.findCardInZone("south", "character", op08TonyTonyChopper007);
    const unrelatedId = engine.findCardInZone("south", "character", op13Higuma013);

    engine.playCard(op08DrumKingdom020);

    let view = engine.getView("south");
    expect(view.players.south.stage?.cardId).toBe(op08DrumKingdom020.id);
    expect(view.players.south.activeDon).toBe(0);
    expect(view.players.south.restedDon).toBe(1);
    expect(
      [exactTypeId, compositeTypeId, unrelatedId].map(
        (instanceId) =>
          view.players.south.characters.find((card) => card?.instanceId === instanceId)?.power,
      ),
    ).toEqual([0, 5000, 3000]);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(
      [exactTypeId, compositeTypeId, unrelatedId].map(
        (instanceId) =>
          view.players.south.characters.find((card) => card?.instanceId === instanceId)?.power,
      ),
    ).toEqual([1000, 6000, 3000]);

    engine.endTurn("north");
    view = engine.getView("south");
    expect(
      [exactTypeId, compositeTypeId, unrelatedId].map(
        (instanceId) =>
          view.players.south.characters.find((card) => card?.instanceId === instanceId)?.power,
      ),
    ).toEqual([0, 5000, 3000]);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
