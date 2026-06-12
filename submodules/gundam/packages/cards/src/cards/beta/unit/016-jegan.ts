import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const betaJegan016: UnitCard = {
  cardNumber: "GD01-016",
  name: "Jegan",
  type: "unit",
  color: "blue",
  traits: ["earth federation"],
  id: "GD01-016_p1",
  externalId: "gundam:gd01-016_p1",
  slug: "jegan-gd01-016-p1",
  displayName: "Jegan",
  set: { code: "BETA", name: "Edition Beta", packageId: "616000" },
  printNumber: "GD01-016_p1",
  printings: [
    {
      id: "GD01-016",
      collectorNumber: "GD01-016",
      cardNumber: "GD01-016",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-016.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-016.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-016_p1",
      collectorNumber: "GD01-016_p1",
      cardNumber: "GD01-016",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-016_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-016_p1.webp?260424",
      productName: "Edition Beta",
    },
    {
      id: "GD01-016_p2",
      collectorNumber: "GD01-016_p2",
      cardNumber: "GD01-016",
      set: {
        code: "GD01",
        name: "Store Tournament Participant Pack 01",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-016_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-016_p2.webp?260424",
      productName: "Store Tournament Participant Pack 01",
    },
    {
      id: "GD01-016_p3",
      collectorNumber: "GD01-016_p3",
      cardNumber: "GD01-016",
      set: {
        code: "GD01",
        name: "Store Tournament Winner Pack 01",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-016_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-016_p3.webp?260424",
      productName: "Store Tournament Winner Pack 01",
    },
  ],
  selectedPrintingId: "GD01-016_p1",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-016_p1.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-016_p1.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 3,
  effect:
    "While you have 2 or more (Earth Federation) Units in play, this card in your hand gets cost -1.<br>",
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
            hasTrait: "earth federation",
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
        "While you have 2 or more (Earth Federation) Units in play, this card in your hand gets cost -1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
