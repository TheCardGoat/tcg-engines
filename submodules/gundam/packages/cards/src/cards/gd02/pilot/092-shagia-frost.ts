import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd02ShagiaFrost092: PilotCard = {
  cardNumber: "GD02-092",
  name: "Shagia Frost",
  type: "pilot",
  color: "red",
  traits: ["new une"],
  id: "GD02-092",
  externalId: "gundam:gd02-092",
  slug: "shagia-frost-gd02-092",
  displayName: "Shagia Frost",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-092",
  printings: [
    {
      id: "GD02-092",
      collectorNumber: "GD02-092",
      cardNumber: "GD02-092",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-092.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-092.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-092",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-092.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-092.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 1,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.<br>【During Link】【Attack】Choose 1 of your (New UNE) Units. It gets AP+2 during this turn.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "addSelfToHand",
          },
        },
      ],
      sourceText: "【Burst】Add this card to your hand.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [{ type: "duringLink" }],
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
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "new une",
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【During Link】【Attack】Choose 1 of your (New UNE) Units. It gets AP+2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
