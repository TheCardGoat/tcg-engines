import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";
test("named Leader or exact trait preserves both Oden play alternatives and shared power", () => {
  const p = buildCardEffects(
    '[On Play] If your Leader is [Edward.Newgate] or has the {Land of Wano} type, play up to 1 {Land of Wano} type Character card or Character card with a type including "Whitebeard Pirates" with 6000 power or less from your hand.',
  );
  expect(p?.effects?.[0]?.conditions).toEqual([
    {
      condition: "compound",
      operator: "or",
      conditions: [
        { condition: "leaderName", name: "Edward.Newgate" },
        { condition: "leaderTrait", trait: "Land of Wano", match: "exact" },
      ],
    },
  ]);
  expect(p?.effects?.[0]?.actions[0]).toMatchObject({
    action: "play",
    filters: [
      { filter: "power", comparison: "lte", value: 6000 },
      {
        filter: "anyOf",
        filters: [
          {
            filter: "allOf",
            filters: [
              { filter: "trait", value: "Land of Wano", match: "exact" },
              { filter: "cardCategory", value: "character" },
            ],
          },
          {
            filter: "allOf",
            filters: [
              { filter: "trait", value: "Whitebeard Pirates", match: "includes" },
              { filter: "cardCategory", value: "character" },
            ],
          },
        ],
      },
    ],
  });
});
