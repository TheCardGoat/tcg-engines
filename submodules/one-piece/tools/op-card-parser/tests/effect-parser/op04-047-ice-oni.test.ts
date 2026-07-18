import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP04-047 Ice Oni", () => {
  test("binds the end-of-battle return to the cost-qualified battled Character", () => {
    expect(
      buildCardEffects(
        "[Your Turn] At the end of a battle in which this Character battles your opponent's Character with a cost of 5 or less, place the opponent's Character you battled with at the bottom of the owner's deck.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "endOfBattle",
          eventFilter: {
            sourceSelf: true,
            targetFilters: [{ filter: "cost", comparison: "lte", value: 5 }],
          },
          conditions: [{ condition: "turn", value: "your" }],
          actions: [
            {
              action: "returnToDeck",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1 },
              },
              position: "bottom",
              triggerEventTarget: true,
            },
          ],
        },
      ],
    });
  });
});
