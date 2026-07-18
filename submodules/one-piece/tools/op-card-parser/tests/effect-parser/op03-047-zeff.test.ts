import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP03-047 Zeff parser regression", () => {
  test("keeps the trailing deck trash optional and all-or-nothing", () => {
    const result = buildCardEffects(
      "[DON!! x1] When this Character's attack deals damage to your opponent's Life, you may trash 7 cards from the top of your deck.\n[On Play] Return up to 1 Character with a cost of 3 or less to the owner's hand, and you may trash 2 cards from the top of your deck.",
    );

    expect(result?.effects?.[1]).toMatchObject({
      trigger: "onPlay",
      actions: [
        { action: "returnToHand", target: { player: "any" } },
        {
          action: "optional",
          actions: [{ action: "trashFromDeck", player: "self", amount: 2 }],
        },
      ],
    });
  });
});
