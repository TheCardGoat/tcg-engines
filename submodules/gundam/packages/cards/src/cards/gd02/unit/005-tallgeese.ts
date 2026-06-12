import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02Tallgeese005: UnitCard = {
  cardNumber: "GD02-005",
  name: "Tallgeese",
  type: "unit",
  color: "blue",
  traits: ["oz"],
  id: "GD02-005",
  externalId: "gundam:gd02-005",
  slug: "tallgeese-gd02-005",
  displayName: "Tallgeese",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-005",
  printings: [
    {
      id: "GD02-005",
      collectorNumber: "GD02-005",
      cardNumber: "GD02-005",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-005.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-005.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-005_p1",
      collectorNumber: "GD02-005_p1",
      cardNumber: "GD02-005",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-005_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-005_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-005",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-005.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-005.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 4,
  effect: "【During Link】【Attack】Choose 1 enemy Unit with 2 or less HP. Rest it.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [{ type: "duringLink" }],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "hp",
                  comparison: "lte",
                  value: 2,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText: "【During Link】【Attack】Choose 1 enemy Unit with 2 or less HP. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
