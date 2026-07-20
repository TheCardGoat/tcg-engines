import { eb01Doma005, eb01Fourtricks025, op13EdwardNewgate042 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13Rakuyo055 } from "../../../../../cards/src/cards/OP13/characters/055-rakuyo.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-055 Rakuyo", () => {
  test("at four cards in hand gives all own included Whitebeard Pirates Characters +1000 this turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op13Rakuyo055, playedOnTurn: 0 },
          eb01Doma005,
          op13EdwardNewgate042,
          eb01Fourtricks025,
        ],
        hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const rakuyoId = engine.findCardInZone("south", "character", op13Rakuyo055);
    const exactId = engine.findCardInZone("south", "character", eb01Doma005);
    const compositeId = engine.findCardInZone("south", "character", op13EdwardNewgate042);
    const excludedId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    const before = engine.getView("south");
    const basePowers = new Map(
      before.players.south.characters
        .filter((card): card is NonNullable<typeof card> => card !== null)
        .map((card) => [card.instanceId, card.power]),
    );
    const opposingBase = before.players.north.characters.find(
      (card) => card?.instanceId === opposingId,
    )?.power;

    engine.declareAttack(rakuyoId, engine.leader("north"), "south");

    let view = engine.getView("south");
    for (const id of [rakuyoId, exactId, compositeId]) {
      expect(view.players.south.characters.find((card) => card?.instanceId === id)?.power).toBe(
        basePowers.get(id)! + 1000,
      );
    }
    expect(
      view.players.south.characters.find((card) => card?.instanceId === excludedId)?.power,
    ).toBe(basePowers.get(excludedId));
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opposingId)?.power,
    ).toBe(opposingBase);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === exactId)?.power).toBe(
      basePowers.get(exactId),
    );
  });

  test("with five cards in hand does not grant the power bonus", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op13Rakuyo055, playedOnTurn: 0 }, eb01Doma005],
        hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const rakuyoId = engine.findCardInZone("south", "character", op13Rakuyo055);
    const allyId = engine.findCardInZone("south", "character", eb01Doma005);
    const powerBefore = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === allyId)?.power;

    engine.declareAttack(rakuyoId, engine.leader("north"), "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === allyId)
        ?.power,
    ).toBe(powerBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
