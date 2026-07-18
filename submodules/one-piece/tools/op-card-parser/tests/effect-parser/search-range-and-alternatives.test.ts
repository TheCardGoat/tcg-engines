import { describe, expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

function mainSearch(effectText: string) {
  const main = buildCardEffects(effectText)?.effects?.find((block) => block.trigger === "main");
  return main?.actions[0];
}

describe("search ranges and alternative card descriptions", () => {
  test("keeps both ends of a printed cost range", () => {
    expect(
      mainSearch(
        "[Main] If your Leader is [Nami], look at 4 cards from the top of your deck; reveal up to 1 card with a cost of 2 to 8 and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
      ),
    ).toMatchObject({
      action: "search",
      revealFilters: [
        { filter: "cost", comparison: "gte", value: 2 },
        { filter: "cost", comparison: "lte", value: 8 },
      ],
    });
  });

  test("uses matching Leader trait alternatives to disambiguate bracketed search traits", () => {
    expect(
      mainSearch(
        "[Main] If your Leader has the [Animal Kingdom Pirates] or [Big Mom Pirates] type, look at 5 cards from the top of your deck; reveal up to 1 [Animal Kingdom Pirates] or [Big Mom Pirates] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
      ),
    ).toMatchObject({
      action: "search",
      revealFilters: [
        {
          filter: "anyOf",
          filters: [
            { filter: "trait", value: "Animal Kingdom Pirates", match: "includes" },
            { filter: "trait", value: "Big Mom Pirates", match: "includes" },
          ],
        },
      ],
    });
  });

  test("keeps a suffix trait or named-card search as alternatives", () => {
    expect(
      mainSearch(
        '[Main] If your Leader\'s type includes "Whitebeard Pirates", look at 3 cards from the top of your deck; reveal up to 1 card with a type including "Whitebeard Pirates" or [Monkey.D.Luffy] and add it to your hand. Then, place the rest at the top or bottom of your deck in any order.',
      ),
    ).toMatchObject({
      action: "search",
      revealFilters: [
        {
          filter: "anyOf",
          filters: [
            { filter: "trait", value: "Whitebeard Pirates", match: "includes" },
            { filter: "name", value: "Monkey.D.Luffy" },
          ],
        },
      ],
    });
  });
});
