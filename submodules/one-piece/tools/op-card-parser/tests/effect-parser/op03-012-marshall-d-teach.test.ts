import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects, parseEffectText } from "../../src/effect-parser/index.ts";

const printedText =
  "[When Attacking] You may trash 1 of your red Characters with 4000 power or more: Draw 1 card. Then, this Character gains +1000 power during this battle.";

describe("OP03-012 Marshall.D.Teach parser regression", () => {
  test("preserves the qualified field-trash text as an optional cost", () => {
    expect(parseEffectText(printedText).segments[0]).toMatchObject({
      triggers: ["whenAttacking"],
      costs: [
        {
          type: "trashCharacter",
          raw: "trash 1 of your red Characters with 4000 power or more",
        },
      ],
      optional: true,
    });
  });

  test("builds a trash-Character payment before the ordered draw and battle buff", () => {
    expect(buildCardEffects(printedText)).toEqual({
      effects: [
        {
          trigger: "whenAttacking",
          costs: [
            {
              cost: "trashCharacter",
              amount: 1,
              filters: [
                { filter: "color", value: "red" },
                { filter: "power", comparison: "gte", value: 4000 },
              ],
            },
          ],
          actions: [
            { action: "draw", player: "self", amount: 1 },
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: 1 },
                self: true,
              },
              value: 1000,
              duration: "thisBattle",
            },
          ],
          optional: true,
        },
      ],
    });
  });
});
