import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP04-011 through OP04-025 parser regressions", () => {
  test("preserves Nami's conditional reveal, power threshold, and bottom placement", () => {
    expect(
      buildCardEffects(
        "[When Attacking] Reveal 1 card from the top of your deck. If the revealed card is a Character card with 6000 power or more, this Character gains +3000 power during this turn. Then, place the revealed card at the bottom of your deck.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "whenAttacking",
          actions: [
            {
              action: "revealTopDeckCard",
              player: "self",
              conditional: {
                filters: [
                  { filter: "cardCategory", value: "character" },
                  { filter: "basePower", comparison: "gte", value: 6000 },
                ],
                actions: [
                  {
                    action: "modifyPower",
                    target: {
                      player: "self",
                      zones: ["character"],
                      count: { amount: 1 },
                      self: true,
                    },
                    value: 3000,
                    duration: "thisTurn",
                  },
                ],
              },
              finalPosition: "bottom",
            },
          ],
        },
      ],
    });
  });

  test("preserves Cobra's included Alabasta type and source exclusion", () => {
    expect(
      buildCardEffects(
        "[Your Turn] All of your [Alabasta] type Characters other than this Character gain +1000 power.",
      ),
    ).toEqual({
      permanentEffects: [
        {
          conditions: [{ condition: "turn", value: "your" }],
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: "all" },
                filters: [
                  { filter: "trait", value: "Alabasta", match: "includes" },
                  { filter: "excludeSelf" },
                ],
              },
              value: 1000,
              duration: "permanent",
            },
          ],
        },
      ],
    });
  });

  test.each([
    [
      "Viola",
      "[On Your Opponent's Attack] (2) (You may rest the specified number of DON!! cards in your cost area.): Rest up to 1 of your opponent's DON!! cards.",
      { player: "opponent", zones: ["costArea"], count: { amount: 1, upTo: true } },
    ],
    [
      "Giolla",
      "[On Your Opponent's Attack] (2) (You may rest the specified number of DON!! cards in your cost area.): Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
      {
        player: "opponent",
        zones: ["character"],
        count: { amount: 1, upTo: true },
        filters: [{ filter: "cost", comparison: "lte", value: 4 }],
      },
    ],
  ])("marks %s's circled-DON attack effect optional", (_name, text, target) => {
    expect(buildCardEffects(text)).toEqual({
      effects: [
        {
          trigger: "onOpponentAttack",
          costs: [{ cost: "restDon", amount: 2 }],
          actions: [{ action: "rest", target }],
          optional: true,
        },
      ],
    });
  });

  test("uses the opponent-character-play trigger for Sugar and keeps On Play independent", () => {
    const effects = buildCardEffects(
      "[Opponent's Turn] [Once Per Turn] When your opponent plays a Character, if your Leader has the [Donquixote Pirates] type, rest up to 1 of your opponent's Characters. Then, rest this Character. [On Play] Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
    );

    expect(effects?.effects?.[0]).toMatchObject({
      trigger: "whenOpponentPlaysCharacter",
      conditions: [
        { condition: "turn", value: "opponent" },
        {
          condition: "leaderTrait",
          trait: "Donquixote Pirates",
          match: "includes",
        },
      ],
      oncePerTurn: true,
    });
    expect(effects?.effects?.[0]?.optional).toBeUndefined();
    expect(effects?.effects?.[1]).toMatchObject({ trigger: "onPlay" });
  });

  test("treats Kuro's empty official effect as vanilla", () => {
    expect(buildCardEffects("")).toBeUndefined();
  });
});
