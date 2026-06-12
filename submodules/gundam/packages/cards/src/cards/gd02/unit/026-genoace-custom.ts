import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GenoaceCustom026: UnitCard = {
  cardNumber: "GD02-026",
  name: "Genoace Custom",
  type: "unit",
  color: "green",
  traits: ["earth federation"],
  id: "GD02-026",
  externalId: "gundam:gd02-026",
  slug: "genoace-custom-gd02-026",
  displayName: "Genoace Custom",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-026",
  printings: [
    {
      id: "GD02-026",
      collectorNumber: "GD02-026",
      cardNumber: "GD02-026",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-026.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-026.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-026",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-026.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-026.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 2,
  hp: 2,
  effect:
    "【Deploy】If you are Lv.7 or higher, choose 1 of your (AGE System) Units. It gets AP+2 during this turn.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
        conditions: [{ type: "playerLevel", comparison: "gte", value: 7 }],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "AGE System" },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Deploy】If you are Lv.7 or higher, choose 1 of your (AGE System) Units. It gets AP+2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
