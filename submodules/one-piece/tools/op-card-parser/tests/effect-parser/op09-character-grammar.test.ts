import { describe, expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

describe("OP09 Character parser grammar", () => {
  test("keeps alternative search traits inside a shared name exclusion", () => {
    expect(
      buildCardEffects(
        '[On Play] Look at 4 cards from the top of your deck; reveal up to 1 "Cross Guild" type card or card with a type including "Baroque Works" other than [Mr.3(Galdino)] and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
      )?.effects,
    ).toEqual([
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 4,
            source: { player: "self", zone: "deck" },
            revealCount: { amount: 1, upTo: true },
            revealFilters: [
              { filter: "excludeName", value: "Mr.3(Galdino)" },
              {
                filter: "anyOf",
                filters: [
                  { filter: "trait", value: "Cross Guild", match: "includes" },
                  { filter: "trait", value: "Baroque Works", match: "includes" },
                ],
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ]);
  });

  test("keeps an independent conditional self-return after an optional target", () => {
    expect(
      buildCardEffects(
        "[On Play] Place up to 1 of your opponent's Characters at the bottom of the owner's deck. Then, if you do not have 5 Characters with a cost of 5 or more, place this Character at the bottom of the owner's deck.",
      )?.effects,
    ).toEqual([
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
            },
            position: "bottom",
          },
          {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
              self: true,
            },
            position: "bottom",
            condition: {
              condition: "zoneCount",
              player: "self",
              zone: "character",
              comparison: "lt",
              value: 5,
              filters: [{ filter: "cost", comparison: "gte", value: 5 }],
            },
          },
        ],
      },
    ]);
  });

  test("parses a selectable one-or-more DON!! payment before Rush and rest actions", () => {
    expect(
      buildCardEffects(
        "[On Play] You may return 1 or more DON!! cards from your field to your DON!! deck: This Character gains [Rush] during this turn. Then, rest up to 1 of your opponent's Characters with a cost of 6 or less.",
      )?.effects,
    ).toEqual([
      {
        trigger: "onPlay",
        costs: [{ cost: "returnDon", minimumAmount: 1 }],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
              self: true,
            },
            keyword: "rush",
            duration: "thisTurn",
          },
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "cost", comparison: "lte", value: 6 }],
            },
          },
        ],
        optional: true,
      },
    ]);
  });
});
