import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd01SecuringTheSupplyLine102: CommandCard = {
  cardNumber: "GD01-102",
  name: "Securing the Supply Line",
  type: "command",
  color: "blue",
  traits: ["-"],
  id: "GD01-102",
  externalId: "gundam:gd01-102",
  slug: "securing-the-supply-line-gd01-102",
  displayName: "Securing the Supply Line",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-102",
  printings: [
    {
      id: "GD01-102",
      collectorNumber: "GD01-102",
      cardNumber: "GD01-102",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-102.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-102.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-102",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-102.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-102.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  effect: "【Main】All friendly Units that are Lv.4 or lower recover 2 HP.<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "recoverHP",
            amount: 2,
            target: {
              owner: "friendly",
              cardType: "unit",
              count: "all",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        },
      ],
      sourceText: "【Main】All friendly Units that are Lv.4 or lower recover 2 HP.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
