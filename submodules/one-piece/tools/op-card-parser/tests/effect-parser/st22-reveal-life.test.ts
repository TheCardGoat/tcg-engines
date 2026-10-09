import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";
test("ST22-001 preserves revealed identity and optional clauses", () => {
  expect(
    buildCardEffects(
      '[Activate: Main] [Once Per Turn] You may reveal 1 card with a type including "Whitebeard Pirates" from your hand: Draw 1 card and place the revealed card at the top of your deck.',
    ),
  ).toEqual({
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "revealFromHand",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "Whitebeard Pirates",
                match: "includes",
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
            costPaymentTargets: true,
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  });
});
test("ST22-015 preserves revealed identity and optional clauses", () => {
  expect(
    buildCardEffects(
      "[Main] If your Leader's type includes \"Whitebeard Pirates\", play up to 1 [Edward.Newgate] from your hand. Then, you may add 1 card from the top or bottom of your Life cards to your hand. If you do, up to 1 of your Leader gains +2000 power until the end of your opponent's next turn.",
    ),
  ).toEqual({
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Whitebeard Pirates",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "name",
                value: "Edward.Newgate",
              },
            ],
          },
          {
            action: "removeFromLife",
            player: "self",
            count: {
              amount: 1,
              upTo: true,
            },
            destination: "hand",
            position: "choice",
            thenActions: [
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
                duration: "untilEndOfOpponentNextTurn",
              },
            ],
          },
        ],
      },
    ],
  });
});
