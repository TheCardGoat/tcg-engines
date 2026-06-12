import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd04ElanCeresEnhancedPersonNumber5087: PilotCard = {
  cardNumber: "GD04-087",
  name: "Elan Ceres (Enhanced Person Number 5)",
  type: "pilot",
  color: "green",
  traits: ["academy"],
  id: "GD04-087",
  externalId: "gundam:gd04-087",
  slug: "elan-ceres-enhanced-person-number-5-gd04-087",
  displayName: "Elan Ceres (Enhanced Person Number 5)",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-087",
  printings: [
    {
      id: "GD04-087",
      collectorNumber: "GD04-087",
      cardNumber: "GD04-087",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-087.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-087.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-087",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-087.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-087.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 1,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.\n【During Link】【Attack】You may choose 1 of your (Academy) Units. During this battle, battle damage this Unit would receive is dealt to that Unit instead.",
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
        conditions: [{ type: "duringLink" }],
      },
      directives: [
        {
          optional: true,
          action: {
            action: "redirectBattleDamage",
            duration: "thisBattle",
            target: {
              owner: "self",
              cardType: "unit",
            },
            redirectTo: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "academy",
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【During Link】【Attack】You may choose 1 of your (Academy) Units. During this battle, battle damage this Unit would receive is dealt to that Unit instead.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
