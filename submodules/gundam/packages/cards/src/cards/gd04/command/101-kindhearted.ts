import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd04Kindhearted101: CommandCard = {
  cardNumber: "GD04-101",
  name: "Kindhearted",
  type: "command",
  color: "blue",
  traits: [],
  id: "GD04-101",
  externalId: "gundam:gd04-101",
  slug: "kindhearted-gd04-101",
  displayName: "Kindhearted",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-101",
  printings: [
    {
      id: "GD04-101",
      collectorNumber: "GD04-101",
      cardNumber: "GD04-101",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-101.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-101.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-101",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-101.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-101.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  effect:
    "【Burst】Activate this card's 【Main】.\n【Main】/【Action】During this turn, friendly Units can't be destroyed by enemy effects. Then, draw 1.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "activateTiming",
            timing: "main",
          },
        },
      ],
      sourceText: "【Burst】Activate this card's 【Main】.",
    },
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "preventDestroy",
            source: "enemy",
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: "all",
            },
          },
        },
        {
          action: {
            action: "draw",
            count: 1,
          },
        },
      ],
      sourceText:
        "【Main】/【Action】During this turn, friendly Units can't be destroyed by enemy effects. Then, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
