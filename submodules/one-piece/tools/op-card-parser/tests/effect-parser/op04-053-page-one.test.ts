import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP04-053 Page One parser", () => {
  test("uses the controller's Event activation trigger", () => {
    expect(
      buildCardEffects(
        "[DON!! x1] [Once Per Turn] When you activate an Event, draw 1 card. Then, place 1 card from your hand at the bottom of your deck.",
      )?.effects?.[0],
    ).toMatchObject({
      trigger: "whenYouActivateEvent",
      conditions: [{ condition: "donAttached", amount: 1 }],
      oncePerTurn: true,
      actions: [
        { action: "draw", player: "self", amount: 1 },
        {
          action: "returnToDeck",
          target: {
            player: "self",
            zones: ["hand"],
            count: { amount: 1 },
          },
          position: "bottom",
        },
      ],
    });
  });
});
