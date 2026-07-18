import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP04-080 through OP04-088 parser regressions", () => {
  test("keeps Gyats's inclusive Dressrosa target", () => {
    expect(
      buildCardEffects(
        "[On Play] Up to 1 of your [Dressrosa] type Characters can also attack active Characters during this turn.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "canAttackActive",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "trait", value: "Dressrosa", match: "includes" }],
              },
              duration: "thisTurn",
            },
          ],
        },
      ],
    });
  });

  test("keeps Cavendish's Leader-rest cost and mandatory post-K.O. deck trash", () => {
    expect(
      buildCardEffects(
        "[DON!! x1] This Character can also attack active Characters. [When Attacking] You may rest your Leader: K.O. up to 1 of your opponent's Characters with a cost of 1 or less. Then, trash 2 cards from the top of your deck.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "whenAttacking",
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
            },
            { action: "trashFromDeck", player: "self", amount: 2 },
          ],
          optional: true,
        },
      ],
      permanentEffects: [
        {
          conditions: [{ condition: "donAttached", amount: 1 }],
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

  test("keeps Kyros's Leader-or-Corrida K.O. replacement and Rebecca On Play", () => {
    expect(
      buildCardEffects(
        "If this Character would be K.O.'d, you may rest your Leader or 1 [Corrida Coliseum] instead. [On Play] If your Leader is [Rebecca], K.O. up to 1 of your opponent's Characters with a cost of 1 or less. Then, trash 1 card from the top of your deck.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          conditions: [{ condition: "leaderName", name: "Rebecca" }],
          actions: [
            {
              action: "ko",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 1 }],
              },
            },
            { action: "trashFromDeck", player: "self", amount: 1 },
          ],
        },
      ],
      replacementEffects: [
        {
          replacedEvent: "ko",
          eventFilter: { targetSelf: true },
          replacementAction: {
            action: "rest",
            target: {
              player: "self",
              zones: ["leader", "stage"],
              count: { amount: 1 },
              filters: [
                {
                  filter: "anyOf",
                  groups: [
                    [{ filter: "cardCategory", value: "leader" }],
                    [
                      { filter: "cardCategory", value: "stage" },
                      { filter: "name", value: "Corrida Coliseum" },
                    ],
                  ],
                },
              ],
            },
          },
        },
      ],
    });
  });

  test("keeps Sabo's Blocker, effect-K.O. protection, draw, and exact hand trash", () => {
    expect(
      buildCardEffects(
        "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] None of your Characters can be K.O.'d by effects until the start of your next turn. Then, draw 2 cards and trash 2 cards from your hand.",
      ),
    ).toEqual({
      keywords: ["blocker"],
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "cannotBeKod",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: "all" },
              },
              duration: "untilStartOfNextTurn",
              restriction: "byEffect",
            },
            { action: "draw", player: "self", amount: 2 },
            { action: "trashFromHand", player: "self", amount: 2 },
          ],
        },
      ],
    });
  });

  test("keeps all four Stussy play filters", () => {
    expect(
      buildCardEffects(
        '[On Play] Look at 3 cards from the top of your deck and play up to 1 Character card with a type including "CP" other than [Stussy] and a cost of 2 or less. Then, trash the rest.',
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
                { filter: "excludeName", value: "Stussy" },
                { filter: "trait", value: "CP", match: "includes" },
                { filter: "cost", comparison: "lte", value: 2 },
                { filter: "cardCategory", value: "character" },
              ],
              revealDestination: "character",
              remainderPosition: "trash",
            },
          ],
        },
      ],
    });
  });

  test("keeps both Suleiman triggers behind an inclusive Dressrosa Leader gate", () => {
    const actions = [
      {
        action: "modifyCost",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: 1, upTo: true },
        },
        value: -2,
        duration: "thisTurn",
      },
      { action: "trashFromDeck", player: "self", amount: 1 },
    ] as const;
    expect(
      buildCardEffects(
        "[On Play] [When Attacking] If your Leader has the [Dressrosa] type, give up to 1 of your opponent's Characters -2 cost during this turn. Then, trash 1 card from the top of your deck.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          conditions: [{ condition: "leaderTrait", trait: "Dressrosa", match: "includes" }],
          actions,
        },
        {
          trigger: "whenAttacking",
          conditions: [{ condition: "leaderTrait", trait: "Dressrosa", match: "includes" }],
          actions,
        },
      ],
    });
  });

  test("binds Chinjao to its own battle K.O. of an opposing Character", () => {
    expect(
      buildCardEffects(
        "[DON!! x1] When this Character battles and K.O.'s your opponent's Character, draw 2 cards and trash 2 cards from your hand.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "whenCharacterKod",
          eventFilter: { player: "opponent", koCause: "battle", sourceSelf: true },
          conditions: [{ condition: "donAttached", amount: 1 }],
          actions: [
            { action: "draw", player: "self", amount: 2 },
            { action: "trashFromHand", player: "self", amount: 2 },
          ],
        },
      ],
    });
  });

  test("keeps Trafalgar Law's empty official effect vanilla", () => {
    expect(buildCardEffects("")).toBeUndefined();
  });

  test("keeps Hajrudin's numbered direct-Leader rest cost", () => {
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
});
