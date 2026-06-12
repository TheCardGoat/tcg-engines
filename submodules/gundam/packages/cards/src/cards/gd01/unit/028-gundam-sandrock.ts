import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01GundamSandrock028: UnitCard = {
  cardNumber: "GD01-028",
  name: "Gundam Sandrock",
  type: "unit",
  color: "green",
  traits: ["operation meteor"],
  id: "GD01-028",
  externalId: "gundam:gd01-028",
  slug: "gundam-sandrock-gd01-028",
  displayName: "Gundam Sandrock",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-028",
  printings: [
    {
      id: "GD01-028",
      collectorNumber: "GD01-028",
      cardNumber: "GD01-028",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-028.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-028.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-028_p1",
      collectorNumber: "GD01-028_p1",
      cardNumber: "GD01-028",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-028_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-028_p1.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "GD01-028",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-028.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-028.webp?260424",
  legality: "legal",
  level: 5,
  cost: 3,
  ap: 4,
  hp: 4,
  effect: "【Deploy】You may deploy 1 (Maganac Corps) Unit card from your hand.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "deploy",
            target: {
              owner: "friendly",
              cardType: "unit",
              zone: "hand",
              count: 1,
              excludeSource: true,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "maganac corps",
                },
              ],
            },
          },
          optional: true,
        },
      ],
      sourceText: "【Deploy】You may deploy 1 (Maganac Corps) Unit card from your hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
