import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GunEz015: UnitCard = {
  cardNumber: "GD04-015",
  name: "Gun EZ",
  type: "unit",
  color: "blue",
  traits: ["league militaire", "shrike team"],
  id: "GD04-015",
  externalId: "gundam:gd04-015",
  slug: "gun-ez-gd04-015",
  displayName: "Gun EZ",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-015",
  printings: [
    {
      id: "GD04-015",
      collectorNumber: "GD04-015",
      cardNumber: "GD04-015",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-015.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-015.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-015",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-015.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-015.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 3,
  linkCondition: "(Shrike Team) Trait",
  effect:
    "【Deploy】Choose 1 of your active (League Militaire) Units and 1 enemy Unit that is Lv.3 or lower. Rest them.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "friendly",
              cardType: "unit",
              state: "active",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "league militaire",
                },
              ],
              count: 1,
            },
          },
        },
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              count: 1,
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Choose 1 of your active (League Militaire) Units and 1 enemy Unit that is Lv.3 or lower. Rest them.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
