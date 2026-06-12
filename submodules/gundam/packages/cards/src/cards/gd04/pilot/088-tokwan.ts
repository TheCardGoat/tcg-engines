import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd04Tokwan088: PilotCard = {
  cardNumber: "GD04-088",
  name: "Tokwan",
  type: "pilot",
  color: "green",
  traits: ["zeon"],
  id: "GD04-088",
  externalId: "gundam:gd04-088",
  slug: "tokwan-gd04-088",
  displayName: "Tokwan",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-088",
  printings: [
    {
      id: "GD04-088",
      collectorNumber: "GD04-088",
      cardNumber: "GD04-088",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-088.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-088.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-088",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-088.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-088.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 0,
  effect:
    "【Burst】Add this card to your hand.\nWhen this Unit is blocked by an enemy Unit that is Lv.4 or lower, it can't receive battle damage during this battle.",
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
        timing: ["onBlocked"],
        conditions: [{ type: "eventCardIsSelf" }],
      },
      directives: [
        {
          action: {
            action: "preventDamage",
            target: {
              owner: "self",
            },
            unitFilter: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 4 }],
            },
            damageType: "battle",
            duration: "thisBattle",
          },
        },
      ],
      sourceText:
        "When this Unit is blocked by an enemy Unit that is Lv.4 or lower, it can't receive battle damage during this battle.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
