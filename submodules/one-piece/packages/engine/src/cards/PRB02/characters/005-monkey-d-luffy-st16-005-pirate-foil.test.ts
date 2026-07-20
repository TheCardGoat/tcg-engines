import { op01Uta005 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { prb02MonkeyDLuffySt16005PirateFoil005 } from "../../../../../cards/src/cards/PRB02/characters/005-monkey-d-luffy-st16-005-pirate-foil.ts";

import { OnePieceTestEngine } from "../../../index.ts";

function luffyPower(engine: OnePieceTestEngine) {
  const luffyId = engine.findCardInZone(
    "south",
    "character",
    prb02MonkeyDLuffySt16005PirateFoil005,
  );
  return engine
    .getView("south")
    .players.south.characters.find((card) => card?.instanceId === luffyId)?.power;
}

describe("ST16-005 Monkey.D.Luffy", () => {
  test("gains 1000 power with a rested Uta on its controller's field", () => {
    const engine = OnePieceTestEngine.create({
      character: [prb02MonkeyDLuffySt16005PirateFoil005, { card: op01Uta005, rested: true }],
    });

    expect(luffyPower(engine)).toBe(4000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not gain power from an active Uta", () => {
    const engine = OnePieceTestEngine.create({
      character: [prb02MonkeyDLuffySt16005PirateFoil005, op01Uta005],
    });

    expect(luffyPower(engine)).toBe(3000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not count the opponent's rested Uta", () => {
    const engine = OnePieceTestEngine.create(
      { character: [prb02MonkeyDLuffySt16005PirateFoil005] },
      { character: [{ card: op01Uta005, rested: true }] },
    );

    expect(luffyPower(engine)).toBe(3000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
