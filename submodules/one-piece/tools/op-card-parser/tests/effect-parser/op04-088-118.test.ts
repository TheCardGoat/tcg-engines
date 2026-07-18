import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP04-088 through OP04-118 parser regressions", () => {
  test("preserves Hajrudin's optional Leader-rest cost before its cost reduction", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] You may rest your 1 Leader: Give up to 1 of your opponent's Characters -4 cost during this turn.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          costs: [
            {
              cost: "restCards",
              amount: 1,
              filters: [{ filter: "cardCategory", value: "leader" }],
            },
          ],
          actions: [
            {
              action: "modifyCost",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
              },
              value: -4,
              duration: "thisTurn",
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("plays Rabiyan as the physical resolving Trigger card", () => {
    expect(buildCardEffects("[Trigger] Play this card.")).toEqual({
      effects: [
        {
          trigger: "trigger",
          actions: [{ action: "playThisCard" }],
        },
      ],
    });
  });

  test("treats Randolph's legacy NULL sentinel as vanilla", () => {
    expect(buildCardEffects("NULL")).toBeUndefined();
  });

  test("builds Vivi's current-cost-aware permanent Rush grant", () => {
    expect(
      buildCardEffects(
        "All of your red Characters with a cost of 3 or more other than this Character gain [Rush]. (This card can attack on the turn in which it is played.)",
      ),
    ).toEqual({
      permanentEffects: [
        {
          actions: [
            {
              action: "grantKeyword",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: "all" },
                filters: [
                  { filter: "color", value: "red" },
                  { filter: "cost", comparison: "gte", value: 3 },
                  { filter: "excludeSelf" },
                ],
              },
              keyword: "rush",
              duration: "permanent",
            },
          ],
        },
      ],
    });
  });
});
