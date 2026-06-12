import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd04GarmaZabi086: PilotCard = {
  cardNumber: "GD04-086",
  name: "Garma Zabi",
  type: "pilot",
  color: "green",
  traits: ["zeon"],
  id: "GD04-086",
  externalId: "gundam:gd04-086",
  slug: "garma-zabi-gd04-086",
  displayName: "Garma Zabi",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-086",
  printings: [
    {
      id: "GD04-086",
      collectorNumber: "GD04-086",
      cardNumber: "GD04-086",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-086.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-086.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-086",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-086.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-086.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Burst】Add this card to your hand.\n【During Link】【Destroyed】If you have no EX Resources, place 1 EX Resource.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "addSelfToHand",
          },
        },
      ],
      sourceText: "【Burst】Add this card to your hand.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
        conditions: [
          { type: "duringLink" },
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "resourceArea",
            cardType: "resource",
            hasName: "EX Resource",
            comparison: "eq",
            count: 0,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "placeExResource",
            state: "active",
          },
        },
      ],
      sourceText: "【During Link】【Destroyed】If you have no EX Resources, place 1 EX Resource.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
