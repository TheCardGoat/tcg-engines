import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01UnicornGundam02BansheeDestroyMode003: UnitCard = {
  cardNumber: "GD01-003",
  name: "Unicorn Gundam 02 Banshee (Destroy Mode)",
  type: "unit",
  color: "blue",
  traits: ["earth federation"],
  id: "GD01-003",
  externalId: "gundam:gd01-003",
  slug: "unicorn-gundam-02-banshee-destroy-mode-gd01-003",
  displayName: "Unicorn Gundam 02 Banshee (Destroy Mode)",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-003",
  printings: [
    {
      id: "GD01-003",
      collectorNumber: "GD01-003",
      cardNumber: "GD01-003",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-003.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-003.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-003_p1",
      collectorNumber: "GD01-003_p1",
      cardNumber: "GD01-003",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-003_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-003_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-003",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-003.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-003.webp?260424",
  legality: "legal",
  level: 6,
  cost: 4,
  ap: 5,
  hp: 4,
  linkCondition: "[Marida Cruz]",
  effect:
    "【During Link】【Attack】Choose 12 cards from your trash. Return them to their owner's deck and shuffle it. If you do, set this Unit as active. It gains <First Strike> during this turn.\n\n(While this Unit is attacking, it deals damage before the enemy Unit.)",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          { type: "duringLink" },
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 12,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "returnToDeck",
            position: "bottom",
            shuffle: true,
            target: {
              owner: "friendly",
              zone: "trash",
              count: 12,
            },
          },
        },
        {
          action: {
            action: "setActive",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
          dependsOnPrevious: true,
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
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【During Link】【Attack】Choose 12 cards from your trash. Return them to their owner's deck and shuffle it. If you do, set this Unit as active. It gains <First Strike> during this turn. (While this Unit is attacking, it deals damage before the enemy Unit.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
