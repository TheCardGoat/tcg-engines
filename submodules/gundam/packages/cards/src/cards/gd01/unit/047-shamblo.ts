import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01Shamblo047: UnitCard = {
  cardNumber: "GD01-047",
  name: "Shamblo",
  type: "unit",
  color: "red",
  traits: ["zeon"],
  id: "GD01-047",
  externalId: "gundam:gd01-047",
  slug: "shamblo-gd01-047",
  displayName: "Shamblo",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-047",
  printings: [
    {
      id: "GD01-047",
      collectorNumber: "GD01-047",
      cardNumber: "GD01-047",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-047.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-047.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-047_p1",
      collectorNumber: "GD01-047_p1",
      cardNumber: "GD01-047",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-047_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-047_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-047_p2",
      collectorNumber: "GD01-047_p2",
      cardNumber: "GD01-047",
      set: {
        code: "GD01",
        name: "Championship Participation Pack 01",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-047_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-047_p2.webp?260424",
      productName: "Championship Participation Pack 01",
    },
  ],
  selectedPrintingId: "GD01-047",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-047.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-047.webp?260424",
  legality: "legal",
  level: 8,
  cost: 7,
  ap: 6,
  hp: 5,
  effect:
    "【Attack】If 2 or more other rested friendly Units are in play, choose 1 enemy Unit. Deal 3 damage to it.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 2,
            excludeSelf: true,
            state: "rested",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 3,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Attack】If 2 or more other rested friendly Units are in play, choose 1 enemy Unit. Deal 3 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
