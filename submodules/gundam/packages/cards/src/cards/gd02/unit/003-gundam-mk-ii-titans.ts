import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GundamMkIiTitans003: UnitCard = {
  cardNumber: "GD02-003",
  name: "Gundam Mk-II (Titans)",
  type: "unit",
  color: "blue",
  traits: ["titans"],
  id: "GD02-003",
  externalId: "gundam:gd02-003",
  slug: "gundam-mk-ii-titans-gd02-003",
  displayName: "Gundam Mk-II (Titans)",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-003",
  printings: [
    {
      id: "GD02-003",
      collectorNumber: "GD02-003",
      cardNumber: "GD02-003",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-003.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-003.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-003_p1",
      collectorNumber: "GD02-003_p1",
      cardNumber: "GD02-003",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-003_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-003_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-003_p2",
      collectorNumber: "GD02-003_p2",
      cardNumber: "GD02-003",
      set: {
        code: "GD02",
        name: "Store Tournament Participant Pack 02",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-003_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-003_p2.webp?260424",
      productName: "Store Tournament Participant Pack 02",
    },
    {
      id: "GD02-003_p3",
      collectorNumber: "GD02-003_p3",
      cardNumber: "GD02-003",
      set: {
        code: "GD02",
        name: "Store Tournament Winner Pack 02",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-003_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-003_p3.webp?260424",
      productName: "Store Tournament Winner Pack 02",
    },
  ],
  selectedPrintingId: "GD02-003",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-003.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-003.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 2,
  effect:
    "【During Pair･Lv.3 or Lower Pilot】【Destroyed】You may discard 1 Unit card. If you do, return the card paired with this Unit to your hand.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
        qualification: { attribute: "level", comparison: "lte", value: 3 },
        conditions: [{ type: "duringPair" }],
      },
      directives: [
        {
          action: {
            action: "discard",
            count: 1,
          },
        },
      ],
      sourceText:
        "【During Pair·Lv.3 or Lower Pilot】【Destroyed】You may discard 1 Unit card. If you do, return the card paired with this Unit to your hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
