import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";
import { normalize } from "../../src/normalizer.ts";
import { parseAlternateNames, renderAlternateNames } from "../../src/alternate-names.ts";

test("per-Character Main power keeps a separate Life Trigger", () => {
  const result = buildCardEffects(
    "[Main] Your Leader gains +1000 power for each of your Characters during this turn. [Trigger] Up to 1 of your Leader or Character cards gains +1000 power during this turn.",
  );
  expect(result?.effects).toMatchObject([
    {
      trigger: "main",
      actions: [
        {
          action: "modifyPower",
          value: 1000,
          valuePerCardGroup: { size: 1, target: { zones: ["character"] } },
        },
      ],
    },
    { trigger: "trigger", actions: [{ action: "modifyPower", value: 1000 }] },
  ]);
});
test("non-Special battle immunity excludes Leaders and still requires DON", () => {
  expect(
    buildCardEffects(
      "[DON!! x1] This Character cannot be K.O.'d in battle by Characters without the <Special> attribute.",
    )?.permanentEffects?.[0],
  ).toMatchObject({
    conditions: [{ condition: "donAttached", amount: 1 }],
    actions: [
      {
        action: "cannotBeKod",
        restriction: "inBattle",
        byFilter: [
          { filter: "cardCategory", value: "character" },
          { filter: "attribute", value: "special", negate: true },
        ],
      },
    ],
  });
});
test.each(["'", "’"])(
  "rule name alias normalizes and emits metadata (%s apostrophe)",
  (apostrophe) => {
    const card = normalize({
      card_name: "General Franky",
      card_set_id: "P-027",
      set_name: "Promotional",
      set_id: "P",
      card_type: "Character",
      card_color: "Red",
      rarity: "P",
      card_cost: "2",
      card_power: "4000",
      life: null,
      sub_types: "Straw Hat Crew",
      counter_amount: 0,
      attribute: "Ranged",
      card_image_id: null,
      card_image: null,
      inventory_price: 0,
      market_price: 0,
      card_text: `Also treat this card${apostrophe}s name as [Franky] according to the rules. [Opponent's Turn] All of your Characters with 3000 base power or less gain +1000 power.`,
    });
    expect(card.alternateNames).toEqual(["Franky"]);
    expect(renderAlternateNames(card.alternateNames)).toBe('  alternateNames: ["Franky"],');
  },
);
test("temporary name changes and ordinary named targets do not create rule aliases", () => {
  expect(
    parseAlternateNames(
      "This Character's name becomes [Franky] during this turn. Play up to 1 [Franky].",
    ),
  ).toEqual([]);
  expect(renderAlternateNames([])).toBeUndefined();
});
