import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03Farsia058: UnitCard = {
  cardNumber: "GD03-058",
  name: "Farsia",
  type: "unit",
  color: "purple",
  traits: ["ue", "vagan"],
  id: "GD03-058",
  externalId: "gundam:gd03-058",
  slug: "farsia-gd03-058",
  displayName: "Farsia",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-058",
  printings: [
    {
      id: "GD03-058",
      collectorNumber: "GD03-058",
      cardNumber: "GD03-058",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-058.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-058.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-058",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-058.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-058.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 2,
  hp: 2,
  linkCondition: "[Yurin L'Ciel]",
  effect: "This card in your trash gets cost -1.",
  effects: [
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "costReduction",
            amount: 1,
            target: {
              owner: "self",
              cardType: "unit",
              zone: "trash",
            },
          },
        },
      ],
      sourceText: "This card in your trash gets cost -1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
