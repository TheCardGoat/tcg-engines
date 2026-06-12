import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd04MichaelTrinity092: PilotCard = {
  cardNumber: "GD04-092",
  name: "Michael Trinity",
  type: "pilot",
  color: "red",
  traits: ["cb", "trinity"],
  id: "GD04-092",
  externalId: "gundam:gd04-092",
  slug: "michael-trinity-gd04-092",
  displayName: "Michael Trinity",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-092",
  printings: [
    {
      id: "GD04-092",
      collectorNumber: "GD04-092",
      cardNumber: "GD04-092",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-092.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-092.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-092",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-092.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-092.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【When Linked】Choose 1 damaged enemy Unit. Deal 1 damage to it.",
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
              owner: "opponent",
              cardType: "unit",
              state: "damaged",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【When Linked】Choose 1 damaged enemy Unit. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
