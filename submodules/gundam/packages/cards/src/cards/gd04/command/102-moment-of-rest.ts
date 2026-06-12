import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd04MomentOfRest102: CommandCard = {
  cardNumber: "GD04-102",
  name: "Moment of Rest",
  type: "command",
  color: "blue",
  traits: [],
  id: "GD04-102",
  externalId: "gundam:gd04-102",
  slug: "moment-of-rest-gd04-102",
  displayName: "Moment of Rest",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-102",
  printings: [
    {
      id: "GD04-102",
      collectorNumber: "GD04-102",
      cardNumber: "GD04-102",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-102.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-102.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-102_p1",
      collectorNumber: "GD04-102_p1",
      cardNumber: "GD04-102",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-102_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-102_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-102",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-102.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-102.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  effect:
    "【Burst】Draw 1.\n【Main】Choose 1 rested enemy Unit that is Lv.5 or lower. It won't be set as active during the start phase of your opponent's next turn.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "draw",
            count: 1,
          },
        },
      ],
      sourceText: "【Burst】Draw 1.",
    },
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "preventActive",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              state: "rested",
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 5 }],
            },
          },
        },
      ],
      sourceText:
        "【Main】Choose 1 rested enemy Unit that is Lv.5 or lower. It won't be set as active during the start phase of your opponent's next turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
