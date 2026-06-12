import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01NoinSAries007: UnitCard = {
  cardNumber: "GD01-007",
  name: "Noin's Aries",
  type: "unit",
  color: "blue",
  traits: ["oz"],
  id: "GD01-007",
  externalId: "gundam:gd01-007",
  slug: "noin-s-aries-gd01-007",
  displayName: "Noin's Aries",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-007",
  printings: [
    {
      id: "GD01-007",
      collectorNumber: "GD01-007",
      cardNumber: "GD01-007",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-007.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-007.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-007",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-007.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-007.webp?260424",
  legality: "legal",
  level: 3,
  cost: 3,
  ap: 2,
  hp: 3,
  effect: "【Destroyed】If you have another (OZ) Unit in play, draw 1.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
      },
      directives: [
        {
          condition: {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            excludeSelf: true,
            hasTrait: "oz",
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
      sourceText: "【Destroyed】If you have another (OZ) Unit in play, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
