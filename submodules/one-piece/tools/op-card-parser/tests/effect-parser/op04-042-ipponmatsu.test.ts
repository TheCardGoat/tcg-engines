import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP04-042 Ipponmatsu parser", () => {
  test("preserves the Slash target before the mandatory top-deck trash", () => {
    expect(
      buildCardEffects(
        '[On Play] Up to 1 of your "Slash" attribute Characters gains +3000 power during this turn. Then, trash 1 card from the top of your deck.',
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "attribute", value: "slash" }],
              },
              value: 3000,
              duration: "thisTurn",
            },
            {
              action: "trashFromDeck",
              player: "self",
              amount: 1,
            },
          ],
        },
      ],
    });
  });
});
