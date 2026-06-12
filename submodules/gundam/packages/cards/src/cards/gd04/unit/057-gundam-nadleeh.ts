import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GundamNadleeh057: UnitCard = {
  cardNumber: "GD04-057",
  name: "Gundam Nadleeh",
  type: "unit",
  color: "purple",
  traits: ["cb", "gn drive"],
  id: "GD04-057",
  externalId: "gundam:gd04-057",
  slug: "gundam-nadleeh-gd04-057",
  displayName: "Gundam Nadleeh",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-057",
  printings: [
    {
      id: "GD04-057",
      collectorNumber: "GD04-057",
      cardNumber: "GD04-057",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-057.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-057.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-057",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-057.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-057.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 3,
  linkCondition: "[Tieria Erde]",
  effect:
    '【Deploy】Choose 1 enemy Unit that is Lv.6 or lower. During this turn, reduce its AP by an amount equal to the number of Unit cards with "Gundam Virtue" in their card names in your trash.',
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "statModifierByCount",
            countFilter: {
              owner: "friendly",
              cardType: "unit",
              zone: "trash",
              attributeFilters: [
                {
                  attribute: "name",
                  comparison: "includes",
                  value: "Gundam Virtue",
                },
              ],
            },
            stat: "ap",
            amountPerMatch: -1,
            duration: "thisTurn",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 6 }],
            },
          },
        },
      ],
      sourceText:
        '【Deploy】Choose 1 enemy Unit that is Lv.6 or lower. During this turn, reduce its AP by an amount equal to the number of Unit cards with "Gundam Virtue" in their card names in your trash.',
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
