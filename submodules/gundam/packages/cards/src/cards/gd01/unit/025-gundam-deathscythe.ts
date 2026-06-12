import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01GundamDeathscythe025: UnitCard = {
  cardNumber: "GD01-025",
  name: "Gundam Deathscythe",
  type: "unit",
  color: "green",
  traits: ["operation meteor"],
  id: "GD01-025",
  externalId: "gundam:gd01-025",
  slug: "gundam-deathscythe-gd01-025",
  displayName: "Gundam Deathscythe",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-025",
  printings: [
    {
      id: "GD01-025",
      collectorNumber: "GD01-025",
      cardNumber: "GD01-025",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-025.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-025.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-025_p1",
      collectorNumber: "GD01-025_p1",
      cardNumber: "GD01-025",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-025_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-025_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-025",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-025.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-025.webp?260424",
  legality: "legal",
  level: 6,
  cost: 4,
  ap: 5,
  hp: 4,
  linkCondition: "[Duo Maxwell]",
  effect:
    "【When Paired･(Operation Meteor) Pilot】Place 1 rested Resource. Then, this Unit gains <First Strike> during this turn.\n\n(While this Unit is attacking, it deals damage before the enemy Unit.)",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
        qualification: {
          attribute: "trait",
          comparison: "includes",
          value: "operation meteor",
        },
      },
      directives: [
        {
          action: {
            action: "placeResource",
            resourceType: "normal",
            state: "rested",
          },
        },
        {
          action: {
            action: "grantKeyword",
            keyword: "FirstStrike",
            duration: "thisTurn",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【When Paired·(Operation Meteor) Pilot】Place 1 rested Resource. Then, this Unit gains <First Strike> during this turn. (While this Unit is attacking, it deals damage before the enemy Unit.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
