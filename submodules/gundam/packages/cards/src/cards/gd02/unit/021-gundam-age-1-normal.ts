import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GundamAge1Normal021: UnitCard = {
  cardNumber: "GD02-021",
  name: "Gundam AGE-1 Normal",
  type: "unit",
  color: "green",
  traits: ["earth federation", "age system"],
  id: "GD02-021",
  externalId: "gundam:gd02-021",
  slug: "gundam-age-1-normal-gd02-021",
  displayName: "Gundam AGE-1 Normal",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-021",
  printings: [
    {
      id: "GD02-021",
      collectorNumber: "GD02-021",
      cardNumber: "GD02-021",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-021.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-021.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-021_p1",
      collectorNumber: "GD02-021_p1",
      cardNumber: "GD02-021",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-021_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-021_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-021",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-021.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-021.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 2,
  linkCondition: "(Asuno Family) Trait",
  effect:
    "【Deploy】You may discard 1 green (Earth Federation) Unit card. If you do, place 1 EX Resource. Then, if you are Lv.7 or higher, draw 1.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "discard",
            count: 1,
            filter: {
              owner: "friendly",
              zone: "hand",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                { attribute: "color", comparison: "eq", value: "green" },
                { attribute: "trait", comparison: "includes", value: "earth federation" },
              ],
            },
          },
          optional: true,
        },
        {
          action: {
            action: "placeExResource",
            state: "active",
          },
          dependsOnPrevious: true,
        },
        {
          condition: { type: "playerLevel", comparison: "gte", value: 7 },
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
      sourceText:
        "【Deploy】You may discard 1 green (Earth Federation) Unit card. If you do, place 1 EX Resource. Then, if you are Lv.7 or higher, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
