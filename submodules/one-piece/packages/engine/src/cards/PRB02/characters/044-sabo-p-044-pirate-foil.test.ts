import { eb01Doma005, eb01Fourtricks025 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { prb02SaboP044PirateFoil044 } from "../../../../../cards/src/cards/PRB02/characters/044-sabo-p-044-pirate-foil.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("P-044 Sabo", () => {
  test("with DON!! x1 dynamically gains +2000 at four hand cards but not five", () => {
    const fourHand = OnePieceTestEngine.create({
      character: [prb02SaboP044PirateFoil044],
      hand: [eb01Doma005, eb01Doma005, eb01Fourtricks025, eb01Fourtricks025],
      activeDon: 1,
    });
    const boostedId = fourHand.findCardInZone("south", "character", prb02SaboP044PirateFoil044);
    expect(
      fourHand
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === boostedId)?.power,
    ).toBe(prb02SaboP044PirateFoil044.power);
    fourHand.attachDon(boostedId, 1, "south");
    expect(
      fourHand
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === boostedId)?.power,
    ).toBe((prb02SaboP044PirateFoil044.power ?? 0) + 3000);

    const fiveHand = OnePieceTestEngine.create({
      character: [prb02SaboP044PirateFoil044],
      hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Fourtricks025, eb01Fourtricks025],
      activeDon: 1,
    });
    const unboostedId = fiveHand.findCardInZone("south", "character", prb02SaboP044PirateFoil044);
    fiveHand.attachDon(unboostedId, 1, "south");
    expect(
      fiveHand
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === unboostedId)?.power,
    ).toBe((prb02SaboP044PirateFoil044.power ?? 0) + 1000);
  });
});
