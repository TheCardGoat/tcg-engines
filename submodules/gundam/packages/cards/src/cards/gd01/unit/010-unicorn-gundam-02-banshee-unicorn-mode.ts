import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01UnicornGundam02BansheeUnicornMode010: UnitCard = {
  cardNumber: "GD01-010",
  name: "Unicorn Gundam 02 Banshee (Unicorn Mode)",
  type: "unit",
  color: "blue",
  traits: ["earth federation"],
  id: "GD01-010",
  externalId: "gundam:gd01-010",
  slug: "unicorn-gundam-02-banshee-unicorn-mode-gd01-010",
  displayName: "Unicorn Gundam 02 Banshee (Unicorn Mode)",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-010",
  printings: [
    {
      id: "GD01-010",
      collectorNumber: "GD01-010",
      cardNumber: "GD01-010",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-010.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-010.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-010",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-010.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-010.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 3,
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
  rarity: "rare",
};
