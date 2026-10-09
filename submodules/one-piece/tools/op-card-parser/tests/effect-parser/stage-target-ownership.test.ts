import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

describe("Stage target ownership", () => {
  test("keeps Egghead's unqualified set-active target owner-neutral", () => {
    expect(
      buildCardEffects(
        "[End of Your Turn] If you have 3 or less Life cards, set up to 1 [Egghead] type Character with a cost of 5 or less as active. [Trigger] Play this card.",
      )?.effects?.[0]?.actions?.[0],
    ).toMatchObject({
      action: "setActive",
      target: {
        player: "any",
        zones: ["character"],
        count: { amount: 1, upTo: true },
        filters: [
          { filter: "trait", value: "Egghead", match: "exact" },
          { filter: "cost", comparison: "lte", value: 5 },
        ],
      },
    });
  });
});

test.each(["your", "your opponent's"])("preserves explicit %s Character ownership", (owner) => {
  expect(
    buildCardEffects(
      `[Main] Set up to 1 of ${owner} {Egghead} type Characters with a cost of 5 or less as active.`,
    )?.effects?.[0]?.actions?.[0],
  ).toMatchObject({
    action: "setActive",
    target: { player: owner === "your" ? "self" : "opponent" },
  });
});
