import { describe, expect, test } from "vite-plus/test";
import {
  op10Usopp081,
  op11MonkeyDLuffy058,
  op13Higuma013,
  op13MonkeyDLuffy001,
  op13York094,
  prb02ThousandSunnyPirateFoil017,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST14-017 Thousand Sunny (Pirate Foil)", () => {
  test("draws on play and gives only black Straw Hat Crew Characters +1 cost", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op13MonkeyDLuffy001,
      hand: [prb02ThousandSunnyPirateFoil017],
      deck: [op13Higuma013],
      character: [op10Usopp081, op11MonkeyDLuffy058, op13York094],
      activeDon: 1,
    });
    const boostedId = engine.findCardInZone("south", "character", op10Usopp081);
    const wrongColorId = engine.findCardInZone("south", "character", op11MonkeyDLuffy058);
    const wrongTypeId = engine.findCardInZone("south", "character", op13York094);
    const drawnId = engine.findCardInZone("south", "deck", op13Higuma013);

    engine.playCard(prb02ThousandSunnyPirateFoil017);

    const view = engine.getView("south");
    expect(view.players.south.stage?.cardId).toBe("ST14-017");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([drawnId]);
    expect(view.players.south.characters.find((card) => card?.instanceId === boostedId)?.cost).toBe(
      5,
    );
    expect(
      view.players.south.characters.find((card) => card?.instanceId === wrongColorId)?.cost,
    ).toBe(5);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === wrongTypeId)?.cost,
    ).toBe(1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
