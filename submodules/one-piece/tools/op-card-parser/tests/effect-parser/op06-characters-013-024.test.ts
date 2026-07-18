import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP06 Character parser regressions for OP06-013 through OP06-024", () => {
  test("OP06-013 keeps the FILM search and Triggered On Play activation", () => {
    expect(
      buildCardEffects(
        '[On Play] Look at 3 cards from the top of your deck; reveal up to 1 "FILM" type card and add it to your hand. Then, place the rest at the bottom of your deck in any order. [Trigger] Activate this card\'s [On Play] effect.',
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "onPlay",
          actions: [
            {
              action: "search",
              lookCount: 3,
              revealFilters: [{ filter: "trait", value: "FILM", match: "includes" }],
              revealDestination: "hand",
              remainderPosition: "bottom",
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [{ action: "activateEffect", effectTrigger: "onPlay" }],
        },
      ],
    });
  });

  test("OP06-014 scales one battle target by every FILM card trashed", () => {
    expect(
      buildCardEffects(
        "[On Your Opponent's Attack] You may trash any number of [FILM] type cards from your hand. Your Leader or 1 of your Characters gains +1000 power during this battle for every card trashed.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "onOpponentAttack",
          optional: true,
          actions: [
            {
              action: "trashFromHand",
              player: "self",
              amount: "all",
              upTo: true,
              filters: [{ filter: "trait", value: "FILM", match: "includes" }],
            },
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: 1 },
              },
              value: 0,
              valuePerPreviousActionTarget: 1000,
              duration: "thisBattle",
            },
          ],
        },
      ],
    });
  });

  test("OP06-015 keeps its power-qualified trash cost and inclusive play range", () => {
    expect(
      buildCardEffects(
        "[Activate:Main][Once Per Turn] You may trash 1 of your Characters with 6000 power or more: Play up to 1 [FILM] type Character card with 2000 to 5000 power from your trash rested.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "activateMain",
          optional: true,
          oncePerTurn: true,
          costs: [
            {
              cost: "trashCharacter",
              amount: 1,
              filters: [{ filter: "power", comparison: "gte", value: 6000 }],
            },
          ],
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "trash" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "trait", value: "FILM", match: "includes" },
                { filter: "power", comparison: "gte", value: 2000 },
                { filter: "power", comparison: "lte", value: 5000 },
                { filter: "cardCategory", value: "character" },
              ],
              playState: "rested",
            },
          ],
        },
      ],
    });
  });

  test("OP06-023 keeps both its Leader lock and cost-limited rest Trigger", () => {
    expect(
      buildCardEffects(
        "[On Play] You may trash 1 card from your hand: Up to 1 of your opponent's rested Leader cannot attack until the end of your opponent's next turn. [Trigger] Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "onPlay",
          costs: [{ cost: "trashFromHand", amount: 1 }],
          actions: [
            {
              action: "cannotAttack",
              target: {
                player: "opponent",
                zones: ["leader"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "state", value: "rested" }],
              },
              duration: "untilEndOfOpponentNextTurn",
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [
            {
              action: "rest",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 4 }],
              },
            },
          ],
        },
      ],
    });
  });

  test("OP06-024 keeps included traits and mandatory Life removal after the optional play", () => {
    expect(
      buildCardEffects(
        "[On Play] If your Leader has the [New Fish-Man Pirates] type, play up to 1 [Fish-Man] type Character card with a cost of 4 or less from your hand. Then, add 1 card from the top of your Life cards to your hand.",
      ),
    ).toMatchObject({
      effects: [
        {
          trigger: "onPlay",
          conditions: [
            { condition: "leaderTrait", trait: "New Fish-Man Pirates", match: "includes" },
          ],
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "hand" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "cost", comparison: "lte", value: 4 },
                { filter: "trait", value: "Fish-Man", match: "includes" },
                { filter: "cardCategory", value: "character" },
              ],
            },
            {
              action: "removeFromLife",
              player: "self",
              count: { amount: 1 },
              destination: "hand",
              position: "top",
            },
          ],
        },
      ],
    });
  });
});
