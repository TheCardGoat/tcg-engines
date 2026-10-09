import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/index.ts";

test("Foxy requires the rested Leader and allows at most one rested Character", () => {
  expect(
    buildCardEffects(
      "[When Attacking] DON!! −3: If you have 3 or more {Foxy Pirates} type Characters, select your opponent's rested Leader and up to 1 Character card. The selected cards will not become active in your opponent's next Refresh Phase.",
    )?.effects?.[0]?.actions,
  ).toMatchObject([
    {
      action: "conditional",
      whenTrue: [
        {
          action: "freeze",
          target: { player: "opponent", zones: ["leader"], count: { amount: 1 } },
        },
        {
          action: "freeze",
          target: { player: "opponent", zones: ["character"], count: { amount: 1, upTo: true } },
        },
      ],
    },
  ]);
});
