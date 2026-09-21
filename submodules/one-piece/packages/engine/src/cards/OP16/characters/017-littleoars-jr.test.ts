import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

type CharacterFixture = NonNullable<
  NonNullable<Parameters<typeof OnePieceTestEngine.create>[0]>["character"]
>;

function oarsPower(characterFixture: CharacterFixture) {
  const engine = OnePieceTestEngine.create({ character: characterFixture }, {});
  return engine
    .getView("south")
    .players.south.characters.flatMap((card) =>
      card?.cardId === "OP16-017" ? [card.power] : [],
    )[0];
}

describe("OP16-017 LittleOars Jr.", () => {
  test("gives itself -4000 power without a cost-8+ Whitebeard Pirates Character", () => {
    expect(oarsPower([{ cardId: "OP16-017" }])).toBe(4000);
  });

  test("keeps its 8000 power alongside an 8000+ cost-8 Whitebeard Pirates Character", () => {
    expect(oarsPower([{ cardId: "OP16-017" }, { cardId: "OP16-003" }])).toBe(8000);
  });

  test("a Whitebeard Pirates Character below cost 8 does not satisfy the condition", () => {
    // Thatch is a Whitebeard Pirates Character with cost 8... his own cost
    // reduction does not matter here; a cost-4 Morley does not qualify.
    expect(oarsPower([{ cardId: "OP16-017" }, { cardId: "OP16-033" }])).toBe(4000);
  });
});
