import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd04SleggarLaw084: PilotCard = {
  cardNumber: "GD04-084",
  name: "Sleggar Law",
  type: "pilot",
  color: "blue",
  traits: ["earth federation", "white base team"],
  id: "GD04-084",
  externalId: "gundam:gd04-084",
  slug: "sleggar-law-gd04-084",
  displayName: "Sleggar Law",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-084",
  printings: [
    {
      id: "GD04-084",
      collectorNumber: "GD04-084",
      cardNumber: "GD04-084",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-084.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-084.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-084",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-084.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-084.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【Attack】Choose 1 of your (White Base Team) Units. It gets AP+1 during this turn.",
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
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "white base team",
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Attack】Choose 1 of your (White Base Team) Units. It gets AP+1 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
