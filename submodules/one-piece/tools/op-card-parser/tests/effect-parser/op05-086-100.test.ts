import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP05-086 through OP05-100 parser regressions", () => {
  test("builds Vivi's dynamic trash-count Blocker", () => {
    expect(
      buildCardEffects(
        "If you have 10 or more cards in your trash, this Character gains [Blocker]. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
      ),
    ).toEqual({
      permanentEffects: [
        {
          conditions: [
            {
              condition: "zoneCount",
              player: "self",
              zone: "trash",
              comparison: "gte",
              value: 10,
            },
          ],
          actions: [
            {
              action: "grantKeyword",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              keyword: "blocker",
              duration: "permanent",
            },
          ],
        },
      ],
    });
  });

  test("builds all three Mansherry costs and the closed current-cost range", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] (1) (You may rest the specified number of DON!! cards in your cost area.) You may rest this Character and place 2 cards from your trash at the bottom of your deck in any order: Add up to 1 black Character card with a cost of 3 to 5 from your trash to your hand.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          costs: [
            { cost: "restDon", amount: 1 },
            { cost: "restThisCard" },
            { cost: "returnTrashToDeck", amount: 2, position: "bottom" },
          ],
          actions: [
            {
              action: "returnToHand",
              target: {
                player: "self",
                zones: ["trash"],
                count: { amount: 1, upTo: true },
                filters: [
                  { filter: "color", value: "black" },
                  { filter: "cardCategory", value: "character" },
                  { filter: "cost", comparison: "gte", value: 3 },
                  { filter: "cost", comparison: "lte", value: 5 },
                ],
              },
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("builds both inclusive Dressrosa triggers for Riku Doldo III", () => {
    const action = {
      action: "modifyPower" as const,
      target: {
        player: "self" as const,
        zones: ["character" as const],
        count: { amount: 1 as const, upTo: true },
        filters: [{ filter: "trait" as const, value: "Dressrosa", match: "includes" as const }],
      },
      value: 2000,
      duration: "thisTurn" as const,
    };
    expect(
      buildCardEffects(
        "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] / [On K.O.] Up to 1 of your [Dressrosa] type Characters gains +2000 power during this turn.",
      ),
    ).toEqual({
      keywords: ["blocker"],
      effects: [
        { trigger: "onPlay", actions: [action] },
        { trigger: "onKo", actions: [action] },
      ],
    });
  });

  test("builds Lucci's ordered cost and both independent K.O. actions", () => {
    expect(
      buildCardEffects(
        "[On Play] You may place 3 cards from your trash at the bottom of your deck in any order: K.O. up to 1 of your opponent's Characters with a cost of 2 or less and up to 1 of your opponent's Characters with a cost of 1 or less.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          costs: [{ cost: "returnTrashToDeck", amount: 3, position: "bottom" }],
          actions: [
            {
              action: "ko",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 2 }],
              },
            },
            {
              action: "ko",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 1 }],
              },
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("builds Enel's self-only globally-negated leave-field replacement", () => {
    expect(
      buildCardEffects(
        "[Rush] [Once Per Turn] If this Character would leave the field, you may trash 1 card from the top of your Life cards instead. If there is a [Monkey.D.Luffy] Character, this effect is negated.",
      ),
    ).toEqual({
      keywords: ["rush"],
      replacementEffects: [
        {
          replacedEvent: "leaveField",
          eventFilter: { targetSelf: true },
          conditions: [
            {
              condition: "compound",
              operator: "and",
              conditions: [
                {
                  condition: "notHasCard",
                  player: "self",
                  zone: "character",
                  filters: [{ filter: "name", value: "Monkey.D.Luffy" }],
                },
                {
                  condition: "notHasCard",
                  player: "opponent",
                  zone: "character",
                  filters: [{ filter: "name", value: "Monkey.D.Luffy" }],
                },
              ],
            },
          ],
          replacementAction: {
            action: "removeFromLife",
            player: "self",
            count: { amount: 1 },
            destination: "trash",
          },
          oncePerTurn: true,
        },
      ],
    });
  });
});
