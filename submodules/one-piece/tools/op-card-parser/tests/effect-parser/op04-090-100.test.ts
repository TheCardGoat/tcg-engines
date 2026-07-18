import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP04-090/091/092/098/099/100 transformations", () => {
  test("parses Luffy's ordered seven-card trash-to-bottom cost and permanent attack access", () => {
    expect(
      buildCardEffects(
        "This Character can also attack active Characters. [Activate:Main] [Once Per Turn] You may return 7 cards from your trash to the bottom of your deck in any order: Set this Character as active. Then, this Character will not become active in your next Refresh Phase.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          costs: [{ cost: "returnTrashToDeck", amount: 7, position: "bottom" }],
          actions: [
            {
              action: "setActive",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
            },
            {
              action: "freeze",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
            },
          ],
          optional: true,
          oncePerTurn: true,
        },
      ],
      permanentEffects: [
        {
          actions: [
            {
              action: "canAttackActive",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              duration: "permanent",
            },
          ],
        },
      ],
    });
  });

  test("parses Leo's numbered Leader-rest cost without scoping the mandatory mill", () => {
    expect(
      buildCardEffects(
        "[On Play] You may rest your 1 Leader: If your Leader has the [Dressrosa] type, K.O. up to 1 of your opponent's Characters with a cost of 1 or less. Then, trash 2 cards from the top of your deck.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          costs: [
            {
              cost: "restCards",
              amount: 1,
              filters: [{ filter: "cardCategory", value: "leader" }],
            },
          ],
          actions: [
            {
              action: "ko",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 1 }],
              },
              condition: {
                condition: "leaderTrait",
                trait: "Dressrosa",
                match: "includes",
              },
            },
            { action: "trashFromDeck", player: "self", amount: 2 },
          ],
          optional: true,
        },
      ],
    });
  });

  test("matches Rebecca's inclusive Dressrosa search while excluding Rebecca", () => {
    expect(
      buildCardEffects(
        "[On Play] Look at 3 cards from the top of your deck; reveal up to 1 [Dressrosa] type card other than [Rebecca] and add it to your hand. Then, trash the rest.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "search",
              lookCount: 3,
              source: { player: "self", zone: "deck" },
              revealCount: { amount: 1, upTo: true },
              revealFilters: [
                { filter: "excludeName", value: "Rebecca" },
                { filter: "trait", value: "Dressrosa", match: "includes" },
              ],
              revealDestination: "hand",
              remainderPosition: "trash",
            },
          ],
        },
      ],
    });
  });

  test("keeps Toko's filtered hand cost outside the Life-gain condition", () => {
    expect(
      buildCardEffects(
        "[On Play] You may trash 2 [Land of Wano] type cards from your hand: If you have 1 or less Life cards, add 1 card from the top of your deck to the top of your Life cards.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          costs: [
            {
              cost: "trashFromHand",
              amount: 2,
              filters: [{ filter: "trait", value: "Land of Wano", match: "includes" }],
            },
          ],
          actions: [
            {
              action: "addToLife",
              target: { player: "self", zones: ["deck"], count: { amount: 1 } },
              position: "top",
              condition: {
                condition: "lifeCount",
                player: "self",
                comparison: "lte",
                value: 1,
              },
            },
          ],
          optional: true,
        },
      ],
    });
  });

  test("plays Olin's resolving physical Trigger card", () => {
    expect(
      buildCardEffects(
        "Also treat this card's name as [Charlotte Linlin] according to the rules. [Trigger] If you have 1 or less Life cards, play this card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "trigger",
          conditions: [
            {
              condition: "lifeCount",
              player: "self",
              comparison: "lte",
              value: 1,
            },
          ],
          actions: [{ action: "playThisCard" }],
        },
      ],
    });
  });

  test("prevents up to one opposing Leader or Character from attacking this turn", () => {
    expect(
      buildCardEffects(
        "[Trigger] Up to 1 of your opponent's Leader or Character cards cannot attack during this turn.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "trigger",
          actions: [
            {
              action: "cannotAttack",
              target: {
                player: "opponent",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
              },
              duration: "thisTurn",
            },
          ],
        },
      ],
    });
  });
});
