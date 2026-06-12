import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd01InterceptOrders099: CommandCard = {
  cardNumber: "GD01-099",
  name: "Intercept Orders",
  type: "command",
  color: "blue",
  traits: ["-"],
  id: "GD01-099",
  externalId: "gundam:gd01-099",
  slug: "intercept-orders-gd01-099",
  displayName: "Intercept Orders",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-099",
  printings: [
    {
      id: "GD01-099",
      collectorNumber: "GD01-099",
      cardNumber: "GD01-099",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-099.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-099.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-099_p1",
      collectorNumber: "GD01-099_p1",
      cardNumber: "GD01-099",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-099_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-099_p1.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "GD01-099",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-099.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-099.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  effect:
    "【Burst】Choose 1 enemy Unit with 5 or less HP. Rest it.<br>【Main】/【Action】Choose 1 to 2 enemy Units with 3 or less HP. Rest them.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
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
                  value: 5,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Burst】Choose 1 enemy Unit with 5 or less HP. Rest it.",
    },
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
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
              count: {
                min: 1,
                max: 2,
              },
            },
          },
        },
      ],
      sourceText: "【Main】/【Action】Choose 1 to 2 enemy Units with 3 or less HP. Rest them.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
