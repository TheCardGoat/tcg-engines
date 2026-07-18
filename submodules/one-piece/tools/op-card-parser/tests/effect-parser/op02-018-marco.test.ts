import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP02-018 Marco parser regression", () => {
  test("parses the filtered hand-trash cost and physical self-play result", () => {
    expect(
      buildCardEffects(
        '[Blocker] [On K.O.] You may trash 1 card with a type including "Whitebeard Pirates" from your hand: If you have 2 or less Life cards, play this Character card from your trash rested.',
      ),
    ).toEqual({
      keywords: ["blocker"],
      effects: [
        {
          trigger: "onKo",
          costs: [
            {
              cost: "trashFromHand",
              amount: 1,
              filters: [
                {
                  filter: "trait",
                  value: "Whitebeard Pirates",
                  match: "includes",
                },
              ],
            },
          ],
          actions: [
            {
              action: "play",
              source: {
                player: "self",
                zone: "trash",
              },
              count: {
                amount: 1,
              },
              self: true,
              playState: "rested",
              condition: {
                condition: "lifeCount",
                player: "self",
                comparison: "lte",
                value: 2,
              },
            },
          ],
          optional: true,
        },
      ],
    });
  });
});
