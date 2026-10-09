import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/index.ts";

test.each([0, 1000])(
  "Kin'emon preserves combined source and trash payment at power %i",
  (power) => {
    const result = buildCardEffects(
      `[Activate: Main] You may place this Character and 1 [Kin'emon] with ${power} power from your trash at the bottom of your deck in any order: Play up to 1 [Kin'emon] with a cost of 6 from your hand.`,
    );
    expect(result?.effects?.[0]?.costs).toEqual([
      {
        cost: "returnTrashToDeck",
        amount: 1,
        includeSelf: true,
        position: "bottom",
        filters: [
          { filter: "name", value: "Kin'emon" },
          { filter: "power", comparison: "eq", value: power },
        ],
      },
    ]);
    expect(result?.effects?.[0]?.actions).toMatchObject([
      { action: "play", source: { zone: "hand" } },
    ]);
  },
);
