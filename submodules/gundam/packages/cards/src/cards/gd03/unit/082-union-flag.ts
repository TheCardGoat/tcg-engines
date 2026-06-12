import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03UnionFlag082: UnitCard = {
  cardNumber: "GD03-082",
  name: "Union Flag",
  type: "unit",
  color: "white",
  traits: ["superpower bloc"],
  id: "GD03-082",
  externalId: "gundam:gd03-082",
  slug: "union-flag-gd03-082",
  displayName: "Union Flag",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-082",
  printings: [
    {
      id: "GD03-082",
      collectorNumber: "GD03-082",
      cardNumber: "GD03-082",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-082.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-082.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-082",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-082.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-082.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 4,
  hp: 1,
  effect:
    "While you have 2 or more (Superpower Bloc)/(UN) Units in play, this card in your hand gets cost -1.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 2,
            hasTrait: ["superpower bloc", "un"],
          },
        ],
      },
      directives: [
        {
          action: {
            action: "costReduction",
            amount: 1,
            target: {
              owner: "self",
            },
          },
        },
      ],
      sourceText:
        "While you have 2 or more (Superpower Bloc)/(UN) Units in play, this card in your hand gets cost -1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
