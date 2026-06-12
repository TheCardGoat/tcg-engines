import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd04OverwhelmingPressure109: CommandCard = {
  cardNumber: "GD04-109",
  name: "Overwhelming Pressure",
  type: "command",
  color: "red",
  traits: [],
  id: "GD04-109",
  externalId: "gundam:gd04-109",
  slug: "overwhelming-pressure-gd04-109",
  displayName: "Overwhelming Pressure",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-109",
  printings: [
    {
      id: "GD04-109",
      collectorNumber: "GD04-109",
      cardNumber: "GD04-109",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-109.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-109.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-109",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-109.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-109.webp?260424",
  legality: "legal",
  level: 5,
  cost: 3,
  effect: "【Main】/【Action】Choose 1 enemy Unit that is Lv.6 or lower. Deal 4 damage to it.",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 4,
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 6,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 enemy Unit that is Lv.6 or lower. Deal 4 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
