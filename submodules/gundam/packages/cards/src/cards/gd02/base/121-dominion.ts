import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd02Dominion121: BaseCard = {
  cardNumber: "GD02-121",
  name: "Dominion",
  type: "base",
  traits: ["earth alliance", "warship"],
  id: "GD02-121",
  externalId: "gundam:gd02-121",
  slug: "dominion-gd02-121",
  displayName: "Dominion",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-121",
  printings: [
    {
      id: "GD02-121",
      collectorNumber: "GD02-121",
      cardNumber: "GD02-121",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-121.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-121.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-121",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-121.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-121.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand. Then, choose 1 friendly blue Unit. It recovers 2 HP.<br>",
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
        {
          action: {
            action: "recoverHP",
            amount: 2,
            target: {
              owner: "friendly",
              cardType: "unit",
              count: { min: 0, max: 1 },
              attributeFilters: [{ attribute: "color", comparison: "eq", value: "blue" }],
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Add 1 of your Shields to your hand. Then, choose 1 friendly blue Unit. It recovers 2 HP.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
