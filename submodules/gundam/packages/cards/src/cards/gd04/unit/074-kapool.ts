import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04Kapool074: UnitCard = {
  cardNumber: "GD04-074",
  name: "Kapool",
  type: "unit",
  color: "white",
  traits: ["militia"],
  id: "GD04-074",
  externalId: "gundam:gd04-074",
  slug: "kapool-gd04-074",
  displayName: "Kapool",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-074",
  printings: [
    {
      id: "GD04-074",
      collectorNumber: "GD04-074",
      cardNumber: "GD04-074",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-074.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-074.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-074",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-074.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-074.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 3,
  linkCondition: "(Militia) Trait",
  effect: "【Attack】You may pay ①. If you do, draw 1. Then, discard 1.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "payResources",
            count: 1,
          },
          optional: true,
        },
        {
          action: {
            action: "draw",
            count: 1,
          },
          dependsOnPrevious: true,
        },
        {
          action: {
            action: "discard",
            count: 1,
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText: "【Attack】You may pay ①. If you do, draw 1. Then, discard 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
