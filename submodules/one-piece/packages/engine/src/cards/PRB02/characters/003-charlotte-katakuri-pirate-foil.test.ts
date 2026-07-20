import { eb01Doma005, op01RoronoaZoro001, op06Uta001 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { prb02CharlotteKatakuriPirateFoil003 } from "../../../../../cards/src/cards/PRB02/characters/003-charlotte-katakuri-pirate-foil.ts";

import { OnePieceTestEngine } from "../../../index.ts";

function katakuriPower(engine: OnePieceTestEngine) {
  const katakuriId = engine.findCardInZone(
    "south",
    "character",
    prb02CharlotteKatakuriPirateFoil003,
  );
  return engine
    .getView("south")
    .players.south.characters.find((card) => card?.instanceId === katakuriId)?.power;
}

describe("ST16-003 Charlotte Katakuri (Pirate Foil)", () => {
  test("with a FILM Leader gains 2000 power at exactly six own rested cards", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06Uta001,
      character: [prb02CharlotteKatakuriPirateFoil003, { card: eb01Doma005, rested: true }],
      restedDon: 5,
    });

    expect(katakuriPower(engine)).toBe(6000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not count the opponent's rested cards toward its threshold", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op06Uta001,
        character: [prb02CharlotteKatakuriPirateFoil003],
        restedDon: 5,
      },
      { character: [{ card: eb01Doma005, rested: true }], restedDon: 5 },
    );

    expect(katakuriPower(engine)).toBe(4000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not gain power without a FILM Leader even at six rested cards", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01RoronoaZoro001,
      character: [prb02CharlotteKatakuriPirateFoil003, { card: eb01Doma005, rested: true }],
      restedDon: 5,
    });

    expect(katakuriPower(engine)).toBe(4000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
