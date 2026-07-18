import { describe, expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";

describe("OP06-002 through OP06-012 Character parser regressions", () => {
  test("parses Inazuma and Douglas Bullet as live permanent keyword grants", () => {
    expect(
      buildCardEffects("If this Character has 7000 power or more, this Character gains [Banish].")
        ?.permanentEffects,
    ).toHaveLength(1);
    expect(
      buildCardEffects('If your Leader has the "FILM" type, this Character gains [Blocker].')
        ?.permanentEffects,
    ).toHaveLength(1);
  });

  test("keeps Ivankov's Revolutionary Army search inclusive", () => {
    expect(
      JSON.stringify(
        buildCardEffects(
          "[On Play] Look at 3 cards from the top of your deck and play up to 1 [Revolutionary Army] type Character card with 5000 power or less. Then, place the rest at the bottom of your deck in any order.",
        ),
      ),
    ).toContain('"match":"includes"');
  });

  test("parses Shuraiya's official dual trigger with one shared Once Per Turn key", () => {
    const effects = buildCardEffects(
      "[When Attacking] / [On Block] [Once Per Turn] This Character's base power becomes the same as your opponent's Leader until the start of your next turn.",
    )?.effects;
    expect(effects).toHaveLength(2);
    expect(effects?.[0]?.oncePerTurnKey).toBe(effects?.[1]?.oncePerTurnKey);
    expect(effects?.[0]?.oncePerTurnKey).toBeTruthy();
  });

  test("preserves both Leader and Character branches for Bear.King", () => {
    expect(
      buildCardEffects(
        "If your opponent has a Leader or Character with a base power of 6000 or more, this Character cannot be K.O.'d in battle.",
      )?.permanentEffects?.[0]?.conditions,
    ).toEqual([
      {
        condition: "compound",
        operator: "or",
        conditions: [
          {
            condition: "hasCard",
            player: "opponent",
            zone: "leader",
            filters: [{ filter: "basePower", comparison: "gte", value: 6000 }],
          },
          {
            condition: "hasCard",
            player: "opponent",
            zone: "character",
            filters: [{ filter: "basePower", comparison: "gte", value: 6000 }],
          },
        ],
      },
    ]);
  });
});
