import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op03YosakuJohnny053 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-053 Yosaku & Johnny", () => {
  test("gains +2000 only with DON!! x1 and 20 or fewer deck cards", () => {
    const eligible = OnePieceTestEngine.create({
      character: [{ card: op03YosakuJohnny053, attachedDon: 1 }],
      deck: Array.from({ length: 20 }, () => eb01Doma005),
    });
    const eligibleId = eligible.findCardInZone("south", "character", op03YosakuJohnny053);
    expect(
      eligible
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === eligibleId)?.power,
    ).toBe(6000);

    const tooMany = OnePieceTestEngine.create({
      character: [{ card: op03YosakuJohnny053, attachedDon: 1 }],
      deck: Array.from({ length: 21 }, () => eb01Doma005),
    });
    const tooManyId = tooMany.findCardInZone("south", "character", op03YosakuJohnny053);
    expect(
      tooMany
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === tooManyId)?.power,
    ).toBe(4000);

    const noDon = OnePieceTestEngine.create({
      character: [op03YosakuJohnny053],
      deck: Array.from({ length: 20 }, () => eb01Doma005),
    });
    const noDonId = noDon.findCardInZone("south", "character", op03YosakuJohnny053);
    expect(
      noDon.getView("south").players.south.characters.find((card) => card?.instanceId === noDonId)
        ?.power,
    ).toBe(3000);
  });
});
