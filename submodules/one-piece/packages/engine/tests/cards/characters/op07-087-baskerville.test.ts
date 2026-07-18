import { describe, expect, test } from "vite-plus/test";
import type { CharacterCard } from "@tcg/op-types";
import { eb01Doma005, op07Baskerville087 } from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const zeroCostCharacter: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-OP07-087-ZERO-COST",
  canonicalId: "TEST-OP07-087-ZERO-COST",
  name: "Zero Cost Review",
  cost: 0,
  effects: undefined,
};

registerCards([zeroCostCharacter]);

describe("OP07-087 Baskerville", () => {
  test("gains 3000 power only on its turn while the opponent has a cost-0 Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07Baskerville087] },
      { character: [zeroCostCharacter] },
    );
    const baskervilleId = engine.findCardInZone("south", "character", op07Baskerville087);

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === baskervilleId)?.power,
    ).toBe(6000);

    engine.endTurn("south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === baskervilleId)?.power,
    ).toBe(3000);
  });

  test("does not gain power without an opposing cost-0 Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07Baskerville087] },
      { character: [eb01Doma005] },
    );
    const baskervilleId = engine.findCardInZone("south", "character", op07Baskerville087);
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === baskervilleId)?.power,
    ).toBe(3000);
  });
});
