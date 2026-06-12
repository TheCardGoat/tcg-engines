import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01GearaDogaHeavyArmedType053: UnitCard = {
  cardNumber: "GD01-053",
  name: "Geara Doga (Heavy Armed Type)",
  type: "unit",
  color: "red",
  traits: ["neo zeon"],
  id: "GD01-053",
  externalId: "gundam:gd01-053",
  slug: "geara-doga-heavy-armed-type-gd01-053",
  displayName: "Geara Doga (Heavy Armed Type)",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-053",
  printings: [
    {
      id: "GD01-053",
      collectorNumber: "GD01-053",
      cardNumber: "GD01-053",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-053.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-053.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-053",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-053.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-053.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 2,
  effect:
    "【Activate･Main】【Once per Turn】①：Choose 1 enemy Unit with 2 or less AP. Deal 1 damage to it.<br>",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:main"],
        restrictions: [{ type: "oncePerTurn" }],
      },
      cost: {
        payResources: 1,
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
                  value: 2,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Activate·Main】【Once per Turn】①：Choose 1 enemy Unit with 2 or less AP. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
