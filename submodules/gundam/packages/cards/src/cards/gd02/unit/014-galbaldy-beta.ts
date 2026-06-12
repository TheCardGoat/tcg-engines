import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GalbaldyBeta014: UnitCard = {
  cardNumber: "GD02-014",
  name: "Galbaldy Beta",
  type: "unit",
  color: "blue",
  traits: ["titans"],
  id: "GD02-014",
  externalId: "gundam:gd02-014",
  slug: "galbaldy-beta-gd02-014",
  displayName: "Galbaldy Beta",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-014",
  printings: [
    {
      id: "GD02-014",
      collectorNumber: "GD02-014",
      cardNumber: "GD02-014",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-014.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-014.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-014",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-014.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-014.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 3,
  hp: 1,
  effect: "【Deploy】Choose 1 of your (Titans) Units. It gets AP+1 during this turn.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "titans",
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Deploy】Choose 1 of your (Titans) Units. It gets AP+1 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
