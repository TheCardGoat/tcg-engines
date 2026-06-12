import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd02Sodon123: BaseCard = {
  cardNumber: "GD02-123",
  name: "Sodon",
  type: "base",
  traits: ["zeon", "warship"],
  id: "GD02-123",
  externalId: "gundam:gd02-123",
  slug: "sodon-gd02-123",
  displayName: "Sodon",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-123",
  printings: [
    {
      id: "GD02-123",
      collectorNumber: "GD02-123",
      cardNumber: "GD02-123",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-123.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-123.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-123",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-123.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-123.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  hp: 5,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand. Then, choose 1 friendly Unit token. During this turn, it may choose an active enemy Unit with 5 or less AP as its attack target.<br>",
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
            action: "chooseAttackTarget",
            unit: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              isToken: true,
            },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              attributeFilters: [
                {
                  attribute: "ap",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
            duration: "thisTurn",
          },
        },
      ],
      sourceText:
        "【Deploy】Add 1 of your Shields to your hand. Then, choose 1 friendly Unit token. During this turn, it may choose an active enemy Unit with 5 or less AP as its attack target.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
