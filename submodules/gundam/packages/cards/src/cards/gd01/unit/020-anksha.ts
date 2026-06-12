import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01Anksha020: UnitCard = {
  cardNumber: "GD01-020",
  name: "Anksha",
  type: "unit",
  color: "blue",
  traits: ["earth federation"],
  id: "GD01-020",
  externalId: "gundam:gd01-020",
  slug: "anksha-gd01-020",
  displayName: "Anksha",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-020",
  printings: [
    {
      id: "GD01-020",
      collectorNumber: "GD01-020",
      cardNumber: "GD01-020",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-020.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-020.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-020",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-020.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-020.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  ap: 3,
  hp: 3,
  effect: "【Deploy】Choose 1 rested enemy Unit. Deal 1 damage to it.<br>",
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
              cardType: "unit",
              state: "rested",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Deploy】Choose 1 rested enemy Unit. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
