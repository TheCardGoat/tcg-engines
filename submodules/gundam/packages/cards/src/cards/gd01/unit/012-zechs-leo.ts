import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01ZechsLeo012: UnitCard = {
  cardNumber: "GD01-012",
  name: "Zechs' Leo",
  type: "unit",
  color: "blue",
  traits: ["oz"],
  id: "GD01-012",
  externalId: "gundam:gd01-012",
  slug: "zechs-leo-gd01-012",
  displayName: "Zechs' Leo",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-012",
  printings: [
    {
      id: "GD01-012",
      collectorNumber: "GD01-012",
      cardNumber: "GD01-012",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-012.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-012.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-012",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-012.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-012.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 2,
  effect: "【When Paired】Choose 1 enemy Unit with 3 or less HP. Rest it.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
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
                  value: 3,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText: "【When Paired】Choose 1 enemy Unit with 3 or less HP. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
