import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GinnLongRangeReconnaissanceType045: UnitCard = {
  cardNumber: "GD02-045",
  name: "GINN Long-Range Reconnaissance Type",
  type: "unit",
  color: "red",
  traits: ["zaft"],
  id: "GD02-045",
  externalId: "gundam:gd02-045",
  slug: "ginn-long-range-reconnaissance-type-gd02-045",
  displayName: "GINN Long-Range Reconnaissance Type",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-045",
  printings: [
    {
      id: "GD02-045",
      collectorNumber: "GD02-045",
      cardNumber: "GD02-045",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-045.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-045.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-045",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-045.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-045.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 1,
  hp: 1,
  effect: "【Attack】If this Unit has 5 or more AP and it is attacking an enemy Unit, draw 1.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          condition: {
            type: "and",
            conditions: [
              {
                type: "selfStat",
                stat: "ap",
                comparison: "gte",
                value: 5,
              },
              {
                type: "selfIsAttacking",
              },
            ],
          },
          thenDirectives: [
            {
              action: {
                action: "draw",
                count: 1,
              },
            },
          ],
        },
      ],
      sourceText:
        "【Attack】If this Unit has 5 or more AP and it is attacking an enemy Unit, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
