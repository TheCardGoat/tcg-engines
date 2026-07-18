import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP04-107 through OP04-112 parser regressions", () => {
  test("treats the legacy OP04-107 NULL sentinel as vanilla", () => {
    expect(buildCardEffects("NULL")).toBeUndefined();
  });

  test("builds OP04-108 conditional Banish and its physical-card Trigger play", () => {
    expect(
      buildCardEffects(
        "[DON!! x1] This Character gains [Banish]. (When this card deals damage, the target card is trashed without activating its Trigger.) [Trigger] You may trash 1 card from your hand: Play this card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "trigger",
          costs: [{ cost: "trashFromHand", amount: 1 }],
          actions: [{ action: "playThisCard" }],
          optional: true,
        },
      ],
      permanentEffects: [
        {
          conditions: [{ condition: "donAttached", amount: 1 }],
          actions: [
            {
              action: "grantKeyword",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              keyword: "banish",
              duration: "permanent",
            },
          ],
        },
      ],
    });
  });

  test("builds OP04-109 with inclusive Land of Wano matching", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] You may trash this Character: Up to 1 of your [Land of Wano] type Leader or Character cards gains +3000 power during this turn.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          costs: [{ cost: "trashThisCard" }],
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "trait", value: "Land of Wano", match: "includes" }],
              },
              value: 3000,
              duration: "thisTurn",
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("builds OP04-110 with a top-or-bottom face-up Life choice", () => {
    expect(
      buildCardEffects(
        "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On K.O.] Add up to 1 of your opponent's Characters with a cost of 3 or less to the top or bottom of your opponent's Life cards face-up.",
      ),
    ).toEqual({
      keywords: ["blocker"],
      effects: [
        {
          trigger: "onKo",
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
        },
      ],
    });
  });

  test("builds OP04-111 with ordered Homies trash and self-rest costs", () => {
    expect(
      buildCardEffects(
        "[Activate:Main] You may trash 1 of your [Homies] type Characters other than this Character and rest this Character: Set up to 1 of your [Charlotte Linlin] Characters as active. [Trigger] Play this card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          costs: [
            {
              cost: "trashCharacter",
              amount: 1,
              filters: [
                { filter: "excludeSelf" },
                { filter: "trait", value: "Homies", match: "includes" },
              ],
            },
            { cost: "restThisCard" },
          ],
          actions: [
            {
              action: "setActive",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "name", value: "Charlotte Linlin" }],
              },
            },
          ],
          optional: true,
        },
        { trigger: "trigger", actions: [{ action: "playThisCard" }] },
      ],
    });
  });

  test("builds both ordered OP04-112 On Play actions", () => {
    expect(
      buildCardEffects(
        "[On Play] K.O. up to 1 of your opponent's Characters with a cost equal to or less than the total of your and your opponent's Life cards. Then, if you have 1 or less Life cards, add up to 1 card from the top of your deck to the top of your Life cards.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "ko",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "dynamicCost", comparison: "lte", source: "totalLifeCount" }],
              },
            },
            {
              action: "addToLife",
              target: {
                player: "self",
                zones: ["deck"],
                count: { amount: 1, upTo: true },
              },
              position: "top",
              condition: {
                condition: "lifeCount",
                player: "self",
                comparison: "lte",
                value: 1,
              },
            },
          ],
        },
      ],
    });
  });
});
