import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

describe("OP05-003 through OP05-011 Character parser regressions", () => {
  test("OP05-003 keeps the other-Character power gate as a live permanent Rush condition", () => {
    expect(
      buildCardEffects(
        "If you have a Character with 7000 power or more other than this Character, this Character gains [Rush]. (This card can attack on the turn in which it is played.)",
      ),
    ).toEqual({
      permanentEffects: [
        {
          conditions: [
            {
              condition: "hasCard",
              player: "self",
              zone: "character",
              filters: [
                { filter: "excludeSelf" },
                { filter: "power", comparison: "gte", value: 7000 },
              ],
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
              keyword: "rush",
              duration: "permanent",
            },
          ],
        },
      ],
    });
  });

  test("OP05-004 uses inclusive Revolutionary Army matching for the hand play", () => {
    expect(
      buildCardEffects(
        "[Activate:Main][Once Per Turn] If this Character has 7000 power or more, play up to 1 [Revolutionary Army] type Character card with 5000 power or less other than [Emporio.Ivankov] from your hand.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "activateMain",
          conditions: [
            {
              condition: "cardState",
              target: "this",
              property: "power",
              comparison: "gte",
              value: 7000,
            },
          ],
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "hand" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "excludeName", value: "Emporio.Ivankov" },
                { filter: "power", comparison: "lte", value: 5000 },
                { filter: "trait", value: "Revolutionary Army", match: "includes" },
                { filter: "cardCategory", value: "character" },
              ],
            },
          ],
          oncePerTurn: true,
        },
      ],
    });
  });

  test("OP05-005 scopes the Leader trait gate to On Play and keeps When Attacking independent", () => {
    expect(
      buildCardEffects(
        "[On Play] If your Leader has the [Revolutionary Army] type, give up to 1 of your opponent's Leader or Character cards -1000 power during this turn. [When Attacking] If this Character has 7000 power or more, give up to 1 of your opponent's Leader or Character cards -1000 power during this turn.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          conditions: [
            { condition: "leaderTrait", trait: "Revolutionary Army", match: "includes" },
          ],
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "opponent",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
              },
              value: -1000,
              duration: "thisTurn",
            },
          ],
        },
        {
          trigger: "whenAttacking",
          conditions: [
            {
              condition: "cardState",
              target: "this",
              property: "power",
              comparison: "gte",
              value: 7000,
            },
          ],
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "opponent",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
              },
              value: -1000,
              duration: "thisTurn",
            },
          ],
        },
      ],
    });
  });

  test("OP05-006 uses an inclusive Revolutionary Army Leader gate", () => {
    expect(
      buildCardEffects(
        "[On Play] If your Leader has the [Revolutionary Army] type, give up to 1 of your opponent's Characters -3000 power during this turn.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "onPlay",
          conditions: [
            { condition: "leaderTrait", trait: "Revolutionary Army", match: "includes" },
          ],
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
              },
              value: -3000,
              duration: "thisTurn",
            },
          ],
        },
      ],
    });
  });

  test("OP05-011 plays its resolving physical Life Trigger card", () => {
    expect(
      buildCardEffects(
        "[On Play] K.O. up to 1 of your opponent's Characters with 2000 power or less. [Trigger] If your Leader is multicolored, play this card.",
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
                filters: [{ filter: "power", comparison: "lte", value: 2000 }],
              },
            },
          ],
        },
        {
          trigger: "trigger",
          conditions: [{ condition: "leaderMulticolored" }],
          actions: [{ action: "playThisCard" }],
        },
      ],
    });
  });
});
