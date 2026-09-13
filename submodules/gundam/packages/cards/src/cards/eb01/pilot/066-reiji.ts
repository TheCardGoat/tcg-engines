import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const eb01Reiji066: PilotCard = {
  cardNumber: "EB01-066",
  name: "Reiji",
  type: "pilot",
  color: "green",
  traits: ["g generation", "support"],
  id: "EB01-066",
  canonicalId: "EB01-066",
  externalIds: { bandai: "gundam:eb01-066" },
  slug: "reiji-eb01-066",
  displayName: "Reiji",
  rulesText:
    "【Burst】Add this card to your hand.\n【When Paired】Choose 1 friendly (G Generation) Unit. During this turn, it may choose an active enemy Unit with <Blocker> as its attack target.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-066",
  printings: [
    {
      id: "EB01-066",
      artId: "EB01-066",
      setCode: "EB01",
      collectorNumber: "EB01-066",
      cardNumber: "EB01-066",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-066.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-066",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-066.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【When Paired】Choose 1 friendly (G Generation) Unit. During this turn, it may choose an active enemy Unit with <Blocker> as its attack target.",
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
        timing: ["whenPaired"],
      },
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "g generation",
                },
              ],
              count: 1,
            },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              hasKeyword: "Blocker",
            },
            duration: "thisTurn",
          },
        },
      ],
      sourceText:
        "【When Paired】Choose 1 friendly (G Generation) Unit. During this turn, it may choose an active enemy Unit with <Blocker> as its attack target.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
