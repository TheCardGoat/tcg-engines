import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const betaGundamAerial070: UnitCard = {
  cardNumber: "GD01-070",
  name: "Gundam Aerial",
  type: "unit",
  color: "white",
  traits: ["academy"],
  id: "GD01-070_p1",
  externalId: "gundam:gd01-070_p1",
  slug: "gundam-aerial-gd01-070-p1",
  displayName: "Gundam Aerial",
  set: { code: "BETA", name: "Edition Beta", packageId: "616000" },
  printNumber: "GD01-070_p1",
  printings: [
    {
      id: "GD01-070",
      collectorNumber: "GD01-070",
      cardNumber: "GD01-070",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-070.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-070.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-070_p1",
      collectorNumber: "GD01-070_p1",
      cardNumber: "GD01-070",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-070_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-070_p1.webp?260424",
      productName: "Edition Beta",
    },
    {
      id: "GD01-070_p2",
      collectorNumber: "GD01-070_p2",
      cardNumber: "GD01-070",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-070_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-070_p2.webp?260424",
      productName: "Edition Beta",
    },
    {
      id: "GD01-070_p3",
      collectorNumber: "GD01-070_p3",
      cardNumber: "GD01-070",
      set: {
        code: "GD01",
        name: "Store Tournament Participant Pack 01",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-070_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-070_p3.webp?260424",
      productName: "Store Tournament Participant Pack 01",
    },
    {
      id: "GD01-070_p4",
      collectorNumber: "GD01-070_p4",
      cardNumber: "GD01-070",
      set: {
        code: "GD01",
        name: "Store Tournament Winner Pack 01",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-070_p4.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-070_p4.webp?260424",
      productName: "Store Tournament Winner Pack 01",
    },
  ],
  selectedPrintingId: "GD01-070_p1",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-070_p1.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-070_p1.webp?260424",
  legality: "legal",
  level: 5,
  cost: 3,
  ap: 3,
  hp: 3,
  effect:
    "While there are 4 or more Command cards in your trash, this card in your hand gets cost -2.<br>",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            cardType: "command",
            comparison: "gte",
            count: 4,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "costReduction",
            amount: 2,
            target: {
              owner: "self",
            },
          },
        },
      ],
      sourceText:
        "While there are 4 or more Command cards in your trash, this card in your hand gets cost -2.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
