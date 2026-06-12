import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const betaDarilbalde075: UnitCard = {
  cardNumber: "GD01-075",
  name: "Darilbalde",
  type: "unit",
  color: "white",
  traits: ["academy"],
  id: "GD01-075_p1",
  externalId: "gundam:gd01-075_p1",
  slug: "darilbalde-gd01-075-p1",
  displayName: "Darilbalde",
  set: { code: "BETA", name: "Edition Beta", packageId: "616000" },
  printNumber: "GD01-075_p1",
  printings: [
    {
      id: "GD01-075",
      collectorNumber: "GD01-075",
      cardNumber: "GD01-075",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-075.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-075.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-075_p1",
      collectorNumber: "GD01-075_p1",
      cardNumber: "GD01-075",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-075_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-075_p1.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "GD01-075_p1",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-075_p1.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-075_p1.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 4,
  hp: 2,
  effect: "【Deploy】Choose 1 enemy Unit with 1 HP. Return it to its owner's hand.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Deploy】Choose 1 enemy Unit with 1 HP. Return it to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
