import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02Hyakuri061: UnitCard = {
  cardNumber: "GD02-061",
  name: "Hyakuri",
  type: "unit",
  color: "purple",
  traits: ["teiwaz"],
  id: "GD02-061",
  externalId: "gundam:gd02-061",
  slug: "hyakuri-gd02-061",
  displayName: "Hyakuri",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-061",
  printings: [
    {
      id: "GD02-061",
      collectorNumber: "GD02-061",
      cardNumber: "GD02-061",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-061.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-061.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-061",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-061.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-061.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  ap: 3,
  hp: 3,
  effect:
    "【When Paired･Purple Pilot】If there are 3 or more (Teiwaz)/(Tekkadan) cards in your trash, choose 1 enemy Unit with 3 or less AP. Rest it.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
        qualification: { attribute: "color", comparison: "eq", value: "purple" },
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 3,
            hasTrait: ["teiwaz", "tekkadan"],
          },
        ],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "ap", comparison: "lte", value: 3 }],
            },
          },
        },
      ],
      sourceText:
        "【When Paired·Purple Pilot】If there are 3 or more (Teiwaz)/(Tekkadan) cards in your trash, choose 1 enemy Unit with 3 or less AP. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
