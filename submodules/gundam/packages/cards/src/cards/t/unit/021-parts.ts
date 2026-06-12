import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const tParts021: UnitCard = {
  cardNumber: "T-021",
  name: "Parts",
  type: "unit",
  traits: ["league militaire"],
  id: "T-021",
  externalId: "gundam:t-021",
  slug: "parts-t-021",
  displayName: "Parts",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "T-021",
  printings: [
    {
      id: "T-021",
      collectorNumber: "T-021",
      cardNumber: "T-021",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/t/T-021.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/T-021.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "T-021",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/t/T-021.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/T-021.webp?260424",
  legality: "legal",
  level: 0,
  cost: 0,
  ap: 1,
  hp: 1,
  effect: "This Unit can't choose the enemy player as its attack target.",
  effects: [
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "cantTargetPlayer",
            whose: "opponent",
          },
        },
      ],
      sourceText: "This Unit can't choose the enemy player as its attack target.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
export const gd04Parts021 = tParts021;
