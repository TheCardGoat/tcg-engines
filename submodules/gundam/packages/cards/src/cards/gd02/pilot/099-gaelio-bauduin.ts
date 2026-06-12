import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd02GaelioBauduin099: PilotCard = {
  cardNumber: "GD02-099",
  name: "Gaelio Bauduin",
  type: "pilot",
  color: "white",
  traits: ["gjallarhorn"],
  id: "GD02-099",
  externalId: "gundam:gd02-099",
  slug: "gaelio-bauduin-gd02-099",
  displayName: "Gaelio Bauduin",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-099",
  printings: [
    {
      id: "GD02-099",
      collectorNumber: "GD02-099",
      cardNumber: "GD02-099",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-099.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-099.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-099",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-099.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-099.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>【When Paired】If there are 4 or more (Gjallarhorn) cards in your trash, choose 1 enemy Unit. It gets AP-2 during this turn.<br>",
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
        timing: ["whenPaired"],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -2,
            duration: "thisTurn",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【When Paired】If there are 4 or more (Gjallarhorn) cards in your trash, choose 1 enemy Unit. It gets AP-2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
