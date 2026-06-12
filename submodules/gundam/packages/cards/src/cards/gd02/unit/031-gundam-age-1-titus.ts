import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GundamAge1Titus031: UnitCard = {
  cardNumber: "GD02-031",
  name: "Gundam AGE-1 Titus",
  type: "unit",
  color: "green",
  traits: ["earth federation", "age system"],
  id: "GD02-031",
  externalId: "gundam:gd02-031",
  slug: "gundam-age-1-titus-gd02-031",
  displayName: "Gundam AGE-1 Titus",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-031",
  printings: [
    {
      id: "GD02-031",
      collectorNumber: "GD02-031",
      cardNumber: "GD02-031",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-031.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-031.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-031",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-031.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-031.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  ap: 2,
  hp: 4,
  effect: "While you are Lv.7 or higher, this Unit gets AP+2.<br>",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "playerLevel",
            comparison: "gte",
            value: 7,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText: "While you are Lv.7 or higher, this Unit gets AP+2.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
