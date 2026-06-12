import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd01ElanCeresEnhancedPersonNumber4098: PilotCard = {
  cardNumber: "GD01-098",
  name: "Elan Ceres (Enhanced Person Number 4)",
  type: "pilot",
  color: "white",
  traits: ["academy"],
  id: "GD01-098",
  externalId: "gundam:gd01-098",
  slug: "elan-ceres-enhanced-person-number-4-gd01-098",
  displayName: "Elan Ceres (Enhanced Person Number 4)",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-098",
  printings: [
    {
      id: "GD01-098",
      collectorNumber: "GD01-098",
      cardNumber: "GD01-098",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-098.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-098.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-098",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-098.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-098.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>【Activate･Action】【Once per Turn】If an enemy Unit with 1 or less AP is in play, this Unit recovers 1 HP.<br>",
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
      type: "activated",
      activation: {
        timing: ["activate:action"],
        restrictions: [{ type: "oncePerTurn" }],
      },
      directives: [
        {
          condition: {
            type: "unitCount",
            owner: "opponent",
            comparison: "gte",
            count: 1,
          },
          thenDirectives: [
            {
              action: {
                action: "recoverHP",
                amount: 1,
                target: {
                  owner: "self",
                  cardType: "unit",
                },
              },
            },
          ],
        },
      ],
      sourceText:
        "【Activate·Action】【Once per Turn】If an enemy Unit with 1 or less AP is in play, this Unit recovers 1 HP.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
