import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd04DeuxMurasame091: PilotCard = {
  cardNumber: "GD04-091",
  name: "Deux Murasame",
  type: "pilot",
  color: "red",
  traits: ["earth federation", "cyber-newtype"],
  id: "GD04-091",
  externalId: "gundam:gd04-091",
  slug: "deux-murasame-gd04-091",
  displayName: "Deux Murasame",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-091",
  printings: [
    {
      id: "GD04-091",
      collectorNumber: "GD04-091",
      cardNumber: "GD04-091",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-091.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-091.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-091",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-091.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-091.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【Destroyed】Choose 1 undamaged enemy Unit. Deal 1 damage to it.",
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
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              state: "undamaged",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Destroyed】Choose 1 undamaged enemy Unit. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
