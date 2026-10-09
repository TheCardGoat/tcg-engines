import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";
test("Ace applies the trailing power threshold to both Character alternatives", () => {
  const parsed = buildCardEffects(
    '[Activate:Main] [Once Per Turn] Up to 1 of your [Monkey.D.Luffy] Characters or up to 1 of your Characters with a type including "Whitebeard Pirates", with 8000 power or more, gains [Rush] during this turn.',
  );
  expect(parsed?.effects?.[0]?.actions).toEqual([
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
              { filter: "name", value: "Monkey.D.Luffy" },
              { filter: "trait", value: "Whitebeard Pirates", match: "includes" },
            ],
          },
          { filter: "power", comparison: "gte", value: 8000 },
        ],
      },
      keyword: "rush",
      duration: "thisTurn",
    },
  ]);
});
