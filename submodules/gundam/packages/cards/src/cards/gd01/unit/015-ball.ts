import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01Ball015: UnitCard = {
  cardNumber: "GD01-015",
  name: "Ball",
  type: "unit",
  color: "blue",
  traits: ["earth federation"],
  id: "GD01-015",
  externalId: "gundam:gd01-015",
  slug: "ball-gd01-015",
  displayName: "Ball",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-015",
  printings: [
    {
      id: "GD01-015",
      collectorNumber: "GD01-015",
      cardNumber: "GD01-015",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-015.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-015.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-015_p1",
      collectorNumber: "GD01-015_p1",
      cardNumber: "GD01-015",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-015_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-015_p1.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "GD01-015",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-015.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-015.webp?260424",
  legality: "legal",
  level: 1,
  cost: 1,
  ap: 1,
  hp: 1,
  effect: "【Attack】Choose 1 of your Units. It recovers 1 HP.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "recoverHP",
            amount: 1,
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Attack】Choose 1 of your Units. It recovers 1 HP.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
