import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01ChuchuSDemiTrainer074: UnitCard = {
  cardNumber: "GD01-074",
  name: "Chuchu's Demi Trainer",
  type: "unit",
  color: "white",
  traits: ["academy"],
  id: "GD01-074",
  externalId: "gundam:gd01-074",
  slug: "chuchu-s-demi-trainer-gd01-074",
  displayName: "Chuchu's Demi Trainer",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-074",
  printings: [
    {
      id: "GD01-074",
      collectorNumber: "GD01-074",
      cardNumber: "GD01-074",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-074.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-074.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-074",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-074.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-074.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 3,
  hp: 1,
  effect: "【Attack】Draw 1. Then, discard 1.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "draw",
            count: 1,
          },
        },
        {
          action: {
            action: "discard",
            count: 1,
          },
        },
      ],
      sourceText: "【Attack】Draw 1. Then, discard 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
