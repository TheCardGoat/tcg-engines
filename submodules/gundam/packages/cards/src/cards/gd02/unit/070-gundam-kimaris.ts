import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GundamKimaris070: UnitCard = {
  cardNumber: "GD02-070",
  name: "Gundam Kimaris",
  type: "unit",
  color: "white",
  traits: ["gjallarhorn", "gundam frame"],
  id: "GD02-070",
  externalId: "gundam:gd02-070",
  slug: "gundam-kimaris-gd02-070",
  displayName: "Gundam Kimaris",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-070",
  printings: [
    {
      id: "GD02-070",
      collectorNumber: "GD02-070",
      cardNumber: "GD02-070",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-070.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-070.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-070_p1",
      collectorNumber: "GD02-070_p1",
      cardNumber: "GD02-070",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-070_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-070_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-070",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-070.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-070.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "[Gaelio Bauduin]",
  effect:
    "【Deploy】If there are 4 or more (Gjallarhorn) cards in your trash, draw 2. If you do, discard 2.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 4,
            hasTrait: "gjallarhorn",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "draw",
            count: 2,
          },
        },
        {
          action: {
            action: "discard",
            count: 2,
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Deploy】If there are 4 or more (Gjallarhorn) cards in your trash, draw 2. If you do, discard 2.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
