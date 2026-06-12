import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01CagalliSSkygrasper080: UnitCard = {
  cardNumber: "GD01-080",
  name: "Cagalli's Skygrasper",
  type: "unit",
  color: "white",
  traits: ["earth alliance"],
  id: "GD01-080",
  externalId: "gundam:gd01-080",
  slug: "cagalli-s-skygrasper-gd01-080",
  displayName: "Cagalli's Skygrasper",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-080",
  printings: [
    {
      id: "GD01-080",
      collectorNumber: "GD01-080",
      cardNumber: "GD01-080",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-080.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-080.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-080",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-080.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-080.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 2,
  hp: 1,
  effect:
    "【Destroyed】Choose 1 enemy Unit that is Lv.2 or lower. Return it to its owner's hand.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
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
        "【Destroyed】Choose 1 enemy Unit that is Lv.2 or lower. Return it to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
