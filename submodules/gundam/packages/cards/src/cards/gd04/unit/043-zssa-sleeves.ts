import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04ZssaSleeves043: UnitCard = {
  cardNumber: "GD04-043",
  name: "Zssa (Sleeves)",
  type: "unit",
  color: "red",
  traits: ["neo zeon"],
  id: "GD04-043",
  externalId: "gundam:gd04-043",
  slug: "zssa-sleeves-gd04-043",
  displayName: "Zssa (Sleeves)",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-043",
  printings: [
    {
      id: "GD04-043",
      collectorNumber: "GD04-043",
      cardNumber: "GD04-043",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-043.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-043.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-043",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-043.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-043.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 3,
  effect: "【Deploy】Choose 1 enemy Base. Deal 1 damage to it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "base",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Deploy】Choose 1 enemy Base. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
