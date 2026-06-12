import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GundamBarbatos1stForm054: UnitCard = {
  cardNumber: "GD02-054",
  name: "Gundam Barbatos 1st Form",
  type: "unit",
  color: "purple",
  traits: ["tekkadan", "gundam frame"],
  id: "GD02-054",
  externalId: "gundam:gd02-054",
  slug: "gundam-barbatos-1st-form-gd02-054",
  displayName: "Gundam Barbatos 1st Form",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-054",
  printings: [
    {
      id: "GD02-054",
      collectorNumber: "GD02-054",
      cardNumber: "GD02-054",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-054.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-054.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-054_p1",
      collectorNumber: "GD02-054_p1",
      cardNumber: "GD02-054",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-054_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-054_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-054_p2",
      collectorNumber: "GD02-054_p2",
      cardNumber: "GD02-054",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-054_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-054_p2.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-054",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-054.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-054.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 2,
  linkCondition: "[Mikazuki Augus]",
  effect: "【Attack】If this Unit is damaged, draw 1.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          condition: {
            type: "selfIsDamaged",
          },
          thenDirectives: [
            {
              action: {
                action: "draw",
                count: 1,
              },
            },
          ],
        },
      ],
      sourceText: "【Attack】If this Unit is damaged, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
