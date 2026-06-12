import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02Byarlant004: UnitCard = {
  cardNumber: "GD02-004",
  name: "Byarlant",
  type: "unit",
  color: "blue",
  traits: ["titans"],
  id: "GD02-004",
  externalId: "gundam:gd02-004",
  slug: "byarlant-gd02-004",
  displayName: "Byarlant",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-004",
  printings: [
    {
      id: "GD02-004",
      collectorNumber: "GD02-004",
      cardNumber: "GD02-004",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-004.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-004.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-004",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-004.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-004.webp?260424",
  legality: "legal",
  level: 5,
  cost: 3,
  ap: 4,
  hp: 3,
  effect:
    "【When Paired】Choose 1 rested enemy Unit with 3 or less HP. It won't be set as active during the start phase of your opponent's next turn.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
      },
      directives: [
        {
          action: {
            action: "preventActive",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              state: "rested",
              attributeFilters: [{ attribute: "hp", comparison: "lte", value: 3 }],
            },
          },
        },
      ],
      sourceText:
        "【When Paired】Choose 1 rested enemy Unit with 3 or less HP. It won't be set as active during the start phase of your opponent's next turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
