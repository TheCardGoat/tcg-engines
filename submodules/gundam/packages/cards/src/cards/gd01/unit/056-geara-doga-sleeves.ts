import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01GearaDogaSleeves056: UnitCard = {
  cardNumber: "GD01-056",
  name: "Geara Doga (Sleeves)",
  type: "unit",
  color: "red",
  traits: ["neo zeon"],
  id: "GD01-056",
  externalId: "gundam:gd01-056",
  slug: "geara-doga-sleeves-gd01-056",
  displayName: "Geara Doga (Sleeves)",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-056",
  printings: [
    {
      id: "GD01-056",
      collectorNumber: "GD01-056",
      cardNumber: "GD01-056",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-056.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-056.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-056",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-056.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-056.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 3,
  effect: "【Destroyed】Choose 1 enemy Unit with 5 or less AP. Deal 1 damage to it.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "ap",
                  comparison: "lte",
                  value: 5,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Destroyed】Choose 1 enemy Unit with 5 or less AP. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
