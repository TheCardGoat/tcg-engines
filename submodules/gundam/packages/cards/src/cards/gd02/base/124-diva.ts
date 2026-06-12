import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd02Diva124: BaseCard = {
  cardNumber: "GD02-124",
  name: "Diva",
  type: "base",
  traits: ["earth federation", "warship"],
  id: "GD02-124",
  externalId: "gundam:gd02-124",
  slug: "diva-gd02-124",
  displayName: "Diva",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-124",
  printings: [
    {
      id: "GD02-124",
      collectorNumber: "GD02-124",
      cardNumber: "GD02-124",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-124.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-124.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-124",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-124.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-124.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand.<br>\nDuring your turn, while you are Lv.7 or higher, all friendly green (Earth Federation) Units get AP+1.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "deploySelf",
          },
        },
      ],
      sourceText: "【Burst】Deploy this card.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "addShieldToHand",
            count: 1,
          },
        },
      ],
      sourceText: "【Deploy】Add 1 of your Shields to your hand.",
    },
    {
      type: "constant",
      activation: {
        conditions: [
          { type: "isTurn", whose: "friendly" },
          { type: "playerLevel", comparison: "gte", value: 7 },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "permanent",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "earth federation",
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "During your turn, while you are Lv.7 or higher, all friendly green (Earth Federation) Units get AP+1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
