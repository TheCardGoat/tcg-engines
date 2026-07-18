import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP05-111 through OP05-119 parser regressions", () => {
  test("OP05-111 preserves the Kotori play cost and opposing Life position choice", () => {
    const result = buildCardEffects(
      "[On Play] You may play 1 [Kotori] from your hand: Add up to 1 of your opponent's Characters with a cost of 3 or less to the top or bottom of your opponent's Life cards face-up.",
    );

    expect(result?.effects).toHaveLength(1);
    const block = result?.effects?.[0];
    expect(block).toMatchObject({
      trigger: "onPlay",
      optional: true,
      actions: [
        {
          action: "addToLife",
          target: {
            player: "opponent",
            zones: ["character"],
            count: { amount: 1, upTo: true },
            filters: [{ filter: "cost", comparison: "lte", value: 3 }],
          },
          position: "choice",
          faceUp: true,
        },
      ],
    });
    expect(block?.costs).toHaveLength(1);
    expect(JSON.stringify(block?.costs)).toContain("Kotori");
  });
});
