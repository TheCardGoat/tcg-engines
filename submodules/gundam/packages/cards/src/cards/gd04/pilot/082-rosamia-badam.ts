import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd04RosamiaBadam082: PilotCard = {
  cardNumber: "GD04-082",
  name: "Rosamia Badam",
  type: "pilot",
  color: "blue",
  traits: ["titans", "cyber-newtype"],
  id: "GD04-082",
  externalId: "gundam:gd04-082",
  slug: "rosamia-badam-gd04-082",
  displayName: "Rosamia Badam",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-082",
  printings: [
    {
      id: "GD04-082",
      collectorNumber: "GD04-082",
      cardNumber: "GD04-082",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-082.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-082.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-082",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-082.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-082.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 2,
  hpBonus: 0,
  effect:
    "【Burst】Add this card to your hand.\n【When Linked】Choose 1 rested Unit. Deal 1 damage to it.",
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
        timing: ["whenLinked"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "any",
              cardType: "unit",
              state: "rested",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【When Linked】Choose 1 rested Unit. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
