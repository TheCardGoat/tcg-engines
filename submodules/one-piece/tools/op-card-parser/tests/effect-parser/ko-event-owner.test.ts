import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/index.ts";

test.each([
  [
    "Kaido",
    "[DON!! x1] [Your Turn] [Once Per Turn] When your opponent's Character is K.O.'d, add up to 1 DON!! card from your DON!! deck and set it as active.",
  ],
  [
    "Lucci with cost before timing",
    "[Your Turn] [Once Per Turn] You may trash 2 cards from your hand: When your opponent's Character is K.O.'d, set this Leader as active.",
  ],
  ["opponent field wording", "When a Character on your opponent's field is K.O.'d, draw 1 card."],
])("preserves opponent ownership in %s", (_, text) => {
  const block = buildCardEffects(text)?.effects?.[0];
  expect(block?.trigger).toBe("whenCharacterKod");
  expect(block?.eventFilter).toEqual({ player: "opponent" });
  if (text.includes("trash 2")) {
    expect(block?.costs).toEqual([{ cost: "trashFromHand", amount: 2 }]);
    expect(block?.optional).toBe(true);
  }
});

test("does not restrict an unqualified Character K.O. observer", () => {
  const block = buildCardEffects("When a Character is K.O.'d, draw 1 card.")?.effects?.[0];
  expect(block?.trigger).toBe("whenCharacterKod");
  expect(block?.eventFilter).toBeUndefined();
});
