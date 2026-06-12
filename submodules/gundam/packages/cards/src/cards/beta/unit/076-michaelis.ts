import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const betaMichaelis076: UnitCard = {
  cardNumber: "GD01-076",
  name: "Michaelis",
  type: "unit",
  color: "white",
  traits: ["academy"],
  id: "GD01-076_p1",
  externalId: "gundam:gd01-076_p1",
  slug: "michaelis-gd01-076-p1",
  displayName: "Michaelis",
  set: { code: "BETA", name: "Edition Beta", packageId: "616000" },
  printNumber: "GD01-076_p1",
  printings: [
    {
      id: "GD01-076",
      collectorNumber: "GD01-076",
      cardNumber: "GD01-076",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-076.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-076.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-076_p1",
      collectorNumber: "GD01-076_p1",
      cardNumber: "GD01-076",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-076_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-076_p1.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "GD01-076_p1",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-076_p1.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-076_p1.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 3,
  effect:
    "While there are 4 or more Command cards in your trash, this Unit gets AP+1 and HP+1.<br>",
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
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
        {
          action: {
            action: "statModifier",
            stat: "hp",
            amount: 1,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "While there are 4 or more Command cards in your trash, this Unit gets AP+1 and HP+1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
