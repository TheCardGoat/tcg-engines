import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/index.ts";

const body =
  "1 card from the top of your deck and play up to 1 Character with a cost of 9 or less other than [Sanji]. Then, place the rest at the bottom of your deck.";

test("Sanji must reveal the top card before the optional filtered play", () => {
  expect(buildCardEffects(`[On Play] Reveal ${body}`)).toMatchObject({
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "revealTopDeckCard",
            player: "self",
            finalPosition: "bottom",
            conditional: {
              filters: [
                { filter: "excludeName", value: "Sanji" },
                { filter: "cost", comparison: "lte", value: 9 },
                { filter: "cardCategory", value: "character" },
              ],
              actions: [
                {
                  action: "play",
                  source: { player: "self", zone: "deck" },
                  topOnly: true,
                  count: { amount: 1, upTo: true },
                },
              ],
            },
          },
        ],
      },
    ],
  });
});

test("a printed look remains a private search", () => {
  expect(buildCardEffects(`[On Play] Look at ${body}`)?.effects?.[0]?.actions?.[0]?.action).toBe(
    "search",
  );
});
