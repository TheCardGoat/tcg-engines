import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

test("ST13-001 preserves all reviewed printed clauses", () => {
  expect(
    buildCardEffects(
      "[DON!! x1] [Activate: Main] [Once Per Turn] You may add 1 of your Characters with a cost of 3 or more and 7000 power or more to the top of your Life cards face-up: Up to 1 of your Characters gains +2000 power until the start of your next turn.",
    ),
  ).toMatchObject({
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        oncePerTurn: true,
        optional: true,
        costs: [
          {
            cost: "addCharacterToLife",
            amount: 1,
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 3,
              },
              {
                filter: "power",
                comparison: "gte",
                value: 7000,
              },
            ],
            position: "top",
            faceUp: true,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "untilStartOfNextTurn",
          },
        ],
      },
    ],
  });
});

test("ST13-002 preserves all reviewed printed clauses", () => {
  expect(
    buildCardEffects(
      "[DON!! x2] [Activate: Main] [Once Per Turn] Look at 5 cards from the top of your deck and add up to 1 Character card with a cost of 5 to the top of your Life cards face-up. Then, place the rest at the bottom of your deck in any order. [End of Your Turn] Trash all your face-up Life cards.",
    ),
  ).toMatchObject({
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
        ],
        oncePerTurn: true,
        actions: [
          {
            action: "search",
            lookCount: 5,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "cost",
                comparison: "eq",
                value: 5,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            revealDestination: "life",
            lifeFaceUp: true,
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "endOfYourTurn",
        actions: [
          {
            action: "trashFromField",
            target: {
              player: "self",
              zones: ["life"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "faceUp",
                  value: true,
                },
              ],
            },
          },
        ],
      },
    ],
  });
});

test("ST13-003 preserves all reviewed printed clauses", () => {
  expect(
    buildCardEffects(
      "Your face-up Life cards are placed at the bottom of your deck instead of being added to your hand, according to the rules. [DON!! x2] [Activate: Main] [Once Per Turn] You may trash 1 card from your hand: If you have 0 Life cards, add up to 2 Character cards with a cost of 5 from your hand or trash to the top of your Life cards face-up.",
    ),
  ).toMatchObject({
    permanentEffects: [
      {
        actions: [
          {
            action: "lifeToHandReplacement",
            player: "self",
            faceUp: true,
            destination: "deck",
            position: "bottom",
          },
        ],
      },
    ],
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
        ],
        oncePerTurn: true,
        optional: true,
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["hand", "trash"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "cost",
                  comparison: "eq",
                  value: 5,
                },
              ],
            },
            position: "top",
            faceUp: true,
            condition: {
              condition: "lifeCount",
              player: "self",
              comparison: "eq",
              value: 0,
            },
          },
        ],
      },
    ],
  });
});

test("ST13-005 preserves all reviewed printed clauses", () => {
  expect(
    buildCardEffects(
      "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] You may trash 1 card from the top or bottom of your Life cards: Reveal up to 1 Character card with a cost of 5 from your hand and add it to the top of your Life cards face-down.",
    ),
  ).toMatchObject({
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        optional: true,
        costs: [
          {
            cost: "trashLife",
            amount: 1,
            position: "choice",
          },
        ],
        actions: [
          {
            action: "revealFromHand",
            player: "self",
            amount: 1,
            upTo: true,
            filters: [
              {
                filter: "cost",
                comparison: "eq",
                value: 5,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            thenActions: [
              {
                action: "addToLife",
                target: {
                  player: "self",
                  zones: ["hand"],
                  count: {
                    amount: 1,
                  },
                },
                previousActionTargets: true,
                position: "top",
              },
            ],
          },
        ],
      },
    ],
  });
});

test("ST13-006 preserves all reviewed printed clauses", () => {
  expect(
    buildCardEffects(
      "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] Play up to 1 each of [Sabo], [Portgas.D.Ace], and [Monkey.D.Luffy] with a cost of 2 from your hand.",
    ),
  ).toMatchObject({
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "playGrouped",
            source: {
              player: "self",
              zone: "hand",
            },
            groups: [
              {
                count: {
                  amount: 1,
                  upTo: true,
                },
                filters: [
                  {
                    filter: "name",
                    value: "Sabo",
                  },
                  {
                    filter: "cost",
                    comparison: "eq",
                    value: 2,
                  },
                ],
              },
              {
                count: {
                  amount: 1,
                  upTo: true,
                },
                filters: [
                  {
                    filter: "name",
                    value: "Portgas.D.Ace",
                  },
                  {
                    filter: "cost",
                    comparison: "eq",
                    value: 2,
                  },
                ],
              },
              {
                count: {
                  amount: 1,
                  upTo: true,
                },
                filters: [
                  {
                    filter: "name",
                    value: "Monkey.D.Luffy",
                  },
                  {
                    filter: "cost",
                    comparison: "eq",
                    value: 2,
                  },
                ],
              },
            ],
            playStates: {
              single: "active",
              multiple: ["active", "active", "active"],
              byGroup: true,
            },
          },
        ],
      },
    ],
  });
});

test("ST13-009 preserves all reviewed printed clauses", () => {
  expect(
    buildCardEffects(
      "[On Play] You may turn 1 of your face-up Life cards face-down: If your opponent has 7 or more cards in their hand, trash up to 1 card from the top of your opponent's Life cards.",
    ),
  ).toMatchObject({
    effects: [
      {
        trigger: "onPlay",
        optional: true,
        costs: [
          {
            cost: "turnLifeFaceUp",
            count: 1,
            faceUp: false,
            position: "any",
          },
        ],
        actions: [
          {
            action: "removeFromLife",
            player: "opponent",
            count: {
              amount: 1,
              upTo: true,
            },
            destination: "trash",
            condition: {
              condition: "handCount",
              player: "opponent",
              comparison: "gte",
              value: 7,
            },
          },
        ],
      },
    ],
  });
});

test("ST13-013 preserves all reviewed printed clauses", () => {
  expect(
    buildCardEffects(
      "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Sabo], [Portgas.D.Ace], or [Monkey.D.Luffy] with a cost of 5 or less and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
    ),
  ).toMatchObject({
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 5,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 5,
              },
              {
                filter: "anyOf",
                filters: [
                  {
                    filter: "name",
                    value: "Sabo",
                  },
                  {
                    filter: "name",
                    value: "Portgas.D.Ace",
                  },
                  {
                    filter: "name",
                    value: "Monkey.D.Luffy",
                  },
                ],
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  });
});

test("ST13-016 preserves all reviewed printed clauses", () => {
  expect(
    buildCardEffects(
      "[Rush] (This card can attack on the turn in which it is played.) [On Play] Look at all your Life cards; place 1 at the top of your deck and place the rest back in your Life area in any order.",
    ),
  ).toMatchObject({
    keywords: ["rush"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rearrangeLife",
            player: "self",
            moveOneToDeckTop: true,
          },
        ],
      },
    ],
  });
});

test("ST14-006 preserves all reviewed printed clauses", () => {
  expect(
    buildCardEffects(
      "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] If you have 6 or less cards in your hand and a Character with a cost of 8 or more, draw 1 card.",
    ),
  ).toMatchObject({
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "handCount",
                player: "self",
                comparison: "lte",
                value: 6,
              },
              {
                condition: "hasCard",
                player: "self",
                zone: "character",
                filters: [
                  {
                    filter: "cost",
                    comparison: "gte",
                    value: 8,
                  },
                ],
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  });
});

test("ST14-014 preserves all reviewed printed clauses", () => {
  expect(
    buildCardEffects(
      "[Counter] If you have a Character with a cost of 8 or more, up to 1 of your Leader or Character cards gains +3000 power during this battle. [Trigger] Add up to 1 of your Character cards with a cost of 2 or less from your trash to your hand.",
    ),
  ).toMatchObject({
    effects: [
      {
        trigger: "counter",
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 8,
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
        ],
      },
    ],
  });
});

test("ST15-003 preserves all reviewed printed clauses", () => {
  expect(
    buildCardEffects(
      "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [Opponent's Turn] When this Character is K.O.'d by an effect, up to 1 of your Leader gains +2000 power during this turn.",
    ),
  ).toMatchObject({
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        eventFilter: { koCause: "effect" },
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  });
});

test("ST17-001 preserves all reviewed printed clauses", () => {
  expect(
    buildCardEffects(
      "[On Play] Reveal 1 card from the top of your deck. If that card is a {The Seven Warlords of the Sea} type card, draw 2 cards and place 1 card from your hand at the top of your deck.",
    ),
  ).toMatchObject({
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "revealTopDeckCard",
            player: "self",
            conditional: {
              filters: [
                {
                  filter: "trait",
                  value: "The Seven Warlords of the Sea",
                  match: "exact",
                },
              ],
              actions: [
                {
                  action: "draw",
                  player: "self",
                  amount: 2,
                },
                {
                  action: "returnToDeck",
                  target: {
                    player: "self",
                    zones: ["hand"],
                    count: {
                      amount: 1,
                    },
                  },
                  position: "top",
                },
              ],
            },
            finalPosition: "top",
          },
        ],
      },
    ],
  });
});

test("ST17-004 preserves all reviewed printed clauses", () => {
  expect(
    buildCardEffects(
      "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] Look at 3 cards from the top of your deck and place them at the top or bottom of your deck in any order. Then, give up to 1 rested DON!! card to 1 of your {The Seven Warlords of the Sea} type Leader or Character cards.",
    ),
  ).toMatchObject({
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 3,
            position: "topOrBottom",
          },
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "The Seven Warlords of the Sea",
                  match: "exact",
                },
              ],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  });
});

test("top-Life orientation payment does not become arbitrary face-up-Life selection", () => {
  const parsed = buildCardEffects(
    "[On Play] You may turn 1 card from the top of your Life cards face-down: Add up to 1 DON!! card from your DON!! deck and set it as active.",
  );
  expect(parsed?.effects?.[0]?.costs).toEqual([
    { cost: "turnLifeFaceUp", count: 1, faceUp: false },
  ]);
});
