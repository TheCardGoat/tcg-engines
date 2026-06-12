import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd04ArmoryOne128: BaseCard = {
  cardNumber: "GD04-128",
  name: "Armory One",
  type: "base",
  traits: ["zaft", "stronghold"],
  id: "GD04-128",
  externalId: "gundam:gd04-128",
  slug: "armory-one-gd04-128",
  displayName: "Armory One",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-128",
  printings: [
    {
      id: "GD04-128",
      collectorNumber: "GD04-128",
      cardNumber: "GD04-128",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-128.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-128.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-128",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-128.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-128.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  hp: 6,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\r\n【Destroyed】All players draw 1.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "deploySelf",
          },
        },
      ],
      sourceText: "【Burst】Deploy this card.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "addShieldToHand",
            count: 1,
          },
        },
      ],
      sourceText: "【Deploy】Add 1 of your Shields to your hand.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
      },
      directives: [
        {
          action: {
            action: "drawAll",
            count: 1,
          },
        },
      ],
      sourceText: "【Destroyed】All players draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
