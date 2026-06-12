import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01Mistral078: UnitCard = {
  cardNumber: "GD01-078",
  name: "Mistral",
  type: "unit",
  color: "white",
  traits: ["earth alliance"],
  id: "GD01-078",
  externalId: "gundam:gd01-078",
  slug: "mistral-gd01-078",
  displayName: "Mistral",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-078",
  printings: [
    {
      id: "GD01-078",
      collectorNumber: "GD01-078",
      cardNumber: "GD01-078",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-078.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-078.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-078",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-078.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-078.webp?260424",
  legality: "legal",
  level: 1,
  cost: 1,
  ap: 1,
  hp: 1,
  effect: "【Deploy】Choose 1 enemy Unit. It gets AP-1 during this turn.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -1,
            duration: "thisTurn",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Deploy】Choose 1 enemy Unit. It gets AP-1 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
