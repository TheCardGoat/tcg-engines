import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01Gundam001: UnitCard = {
  cardNumber: "GD01-001",
  name: "Gundam",
  type: "unit",
  color: "blue",
  traits: ["earth federation", "white base team"],
  id: "GD01-001",
  externalId: "gundam:gd01-001",
  slug: "gundam-gd01-001",
  displayName: "Gundam",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-001",
  printings: [
    {
      id: "GD01-001",
      collectorNumber: "GD01-001",
      cardNumber: "GD01-001",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-001.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-001.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-001_p1",
      collectorNumber: "GD01-001_p1",
      cardNumber: "GD01-001",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-001_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-001_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-001_p2",
      collectorNumber: "GD01-001_p2",
      cardNumber: "GD01-001",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-001_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-001_p2.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-001",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-001.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-001.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 3,
  linkCondition: "[Amuro Ray]",
  effect:
    "All your (White Base Team) Units gain <Repair 1>.\n\n(At the end of your turn, this Unit recovers the specified number of HP.)\n【When Paired】If you have 2 or more other Units in play, draw 1.",
  effects: [
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Repair",
            keywordValue: 1,
            duration: "permanent",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "white base team" },
              ],
            },
          },
        },
      ],
      sourceText: "All your (White Base Team) Units gain <Repair 1>.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 2,
            excludeSelf: true,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "draw",
            count: 1,
          },
        },
      ],
      sourceText: "【When Paired】If you have 2 or more other Units in play, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
