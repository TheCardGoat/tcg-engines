import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd04Financier110: CommandCard = {
  cardNumber: "GD04-110",
  name: "Financier",
  type: "command",
  color: "red",
  traits: [],
  id: "GD04-110",
  externalId: "gundam:gd04-110",
  slug: "financier-gd04-110",
  displayName: "Financier",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-110",
  printings: [
    {
      id: "GD04-110",
      collectorNumber: "GD04-110",
      cardNumber: "GD04-110",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-110.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-110.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-110_p1",
      collectorNumber: "GD04-110_p1",
      cardNumber: "GD04-110",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-110_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-110_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-110",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-110.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-110.webp?260424",
  legality: "legal",
  level: 6,
  cost: 3,
  effect: "【Main】/【Action】Deploy 1 EX Base.",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "deployExBase",
          },
        },
      ],
      sourceText: "【Main】/【Action】Deploy 1 EX Base.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
