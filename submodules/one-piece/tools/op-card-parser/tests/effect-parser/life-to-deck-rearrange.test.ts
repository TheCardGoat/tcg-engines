import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

describe("Life to deck rearrangement", () => {
  test("preserves the leading Life gain and the full private rearrangement", () => {
    expect(
      buildCardEffects(
        "[On Play] Add 1 card from the top of your deck to the top of your Life cards. Then, look at all your Life cards; place 1 card at the top of your deck and place the rest back in your Life area in any order.",
      )?.effects?.[0]?.actions,
    ).toEqual([
      {
        action: "addToLife",
        target: { player: "self", zones: ["deck"], count: { amount: 1 } },
        position: "top",
      },
      { action: "rearrangeLife", player: "self", moveOneToDeckTop: true },
    ]);
  });
});
