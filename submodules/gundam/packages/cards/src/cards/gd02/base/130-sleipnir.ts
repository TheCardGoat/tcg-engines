import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd02Sleipnir130: BaseCard = {
  cardNumber: "GD02-130",
  name: "Sleipnir",
  type: "base",
  traits: ["gjallarhorn", "warship"],
  id: "GD02-130",
  externalId: "gundam:gd02-130",
  slug: "sleipnir-gd02-130",
  displayName: "Sleipnir",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-130",
  printings: [
    {
      id: "GD02-130",
      collectorNumber: "GD02-130",
      cardNumber: "GD02-130",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-130.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-130.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-130",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-130.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-130.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  hp: 5,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand. Then, if a friendly (Gjallarhorn) Unit is in play, choose 1 enemy Unit. It gets AP-2 during this turn.<br>",
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
            action: "statModifier",
            stat: "ap",
            amount: -2,
            duration: "thisTurn",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: { min: 0, max: 1 },
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Add 1 of your Shields to your hand. Then, if a friendly (Gjallarhorn) Unit is in play, choose 1 enemy Unit. It gets AP-2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
