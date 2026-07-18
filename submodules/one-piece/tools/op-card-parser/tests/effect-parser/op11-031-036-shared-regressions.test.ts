import { describe, expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

describe("OP11-031 and OP11-036 shared parser regressions", () => {
  test("OP11-031 parses a once-per-turn activation granting Character Rush to either trait", () => {
    const result = buildCardEffects(
      '[On Play] If your Leader has the "Fish-Man" or "Merfolk" type, rest up to 1 of your opponent\'s Characters with a cost of 5 or less.\n[Activate: Main] [Once Per Turn] Up to 1 of your "Fish-Man" or "Merfolk" type Characters can attack Characters on the turn in which it is played.',
    );

    expect(result?.effects?.[1]).toEqual({
      trigger: "activateMain",
      oncePerTurn: true,
      actions: [
        {
          action: "grantKeyword",
          target: {
            player: "self",
            zones: ["character"],
            count: { amount: 1, upTo: true },
            filters: [
              {
                filter: "anyOf",
                filters: [
                  { filter: "trait", value: "Fish-Man", match: "includes" },
                  { filter: "trait", value: "Merfolk", match: "includes" },
                ],
              },
            ],
          },
          keyword: "rushCharacter",
          duration: "permanent",
        },
      ],
    });
  });

  test("OP11-036 keeps a quoted typed card or quoted named card as alternatives", () => {
    const result = buildCardEffects(
      '[On Play] If your Leader is "Shirahoshi", look at 5 cards from the top of your deck; reveal up to 1 "Neptunian" type card or "Shirahoshi" and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
    );

    expect(result?.effects?.[0]?.actions[0]).toMatchObject({
      action: "search",
      revealFilters: [
        {
          filter: "anyOf",
          filters: [
            { filter: "trait", value: "Neptunian", match: "includes" },
            { filter: "name", value: "Shirahoshi" },
          ],
        },
      ],
    });
  });
});
