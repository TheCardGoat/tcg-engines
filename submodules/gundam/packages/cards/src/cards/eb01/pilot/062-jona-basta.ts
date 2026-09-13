import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const eb01JonaBasta062: PilotCard = {
  cardNumber: "EB01-062",
  name: "Jona Basta",
  type: "pilot",
  color: "blue",
  traits: ["g generation", "durability"],
  id: "EB01-062",
  canonicalId: "EB01-062",
  externalIds: { bandai: "gundam:eb01-062" },
  slug: "jona-basta-eb01-062",
  displayName: "Jona Basta",
  rulesText:
    "【Burst】Add this card to your hand.\n【Attack】【Once per Turn】Choose 1 enemy player. They may draw 1. If they draw with this effect, draw 1.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-062",
  printings: [
    {
      id: "EB01-062",
      artId: "EB01-062",
      setCode: "EB01",
      collectorNumber: "EB01-062",
      cardNumber: "EB01-062",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-062.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-062",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-062.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 1,
  apBonus: 1,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.\n【Attack】【Once per Turn】Choose 1 enemy player. They may draw 1. If they draw with this effect, draw 1.",
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
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "queueEffectForOpponent",
            effect: {
              type: "triggered",
              activation: { timing: [] },
              directives: [
                { optional: true, action: { action: "draw", count: 1 } },
                {
                  dependsOnPrevious: true,
                  action: {
                    action: "queueEffectForOpponent",
                    effect: {
                      type: "triggered",
                      activation: { timing: [] },
                      directives: [{ action: { action: "draw", count: 1 } }],
                      sourceText: "Draw 1.",
                    },
                  },
                },
              ],
              sourceText: "You may draw 1. If you do, your opponent draws 1.",
            },
          },
        },
      ],
      sourceText:
        "【Attack】【Once per Turn】Choose 1 enemy player. They may draw 1. If they draw with this effect, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
