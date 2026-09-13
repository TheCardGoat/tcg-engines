import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const eb01YuuKajima072: PilotCard = {
  cardNumber: "EB01-072",
  name: "Yuu Kajima",
  type: "pilot",
  color: "white",
  traits: ["g generation", "attack"],
  id: "EB01-072",
  canonicalId: "EB01-072",
  externalIds: { bandai: "gundam:eb01-072" },
  slug: "yuu-kajima-eb01-072",
  displayName: "Yuu Kajima",
  rulesText:
    "【Burst】Add this card to your hand.\n【When Paired】Choose 1 active friendly Unit with <Blocker> and 1 enemy Unit that is Lv.4 or lower. Rest them.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-072",
  printings: [
    {
      id: "EB01-072",
      artId: "EB01-072",
      setCode: "EB01",
      collectorNumber: "EB01-072",
      cardNumber: "EB01-072",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-072.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-072",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-072.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 1,
  apBonus: 1,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.\n【When Paired】Choose 1 active friendly Unit with <Blocker> and 1 enemy Unit that is Lv.4 or lower. Rest them.",
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
            action: "rest",
            target: {
              owner: "friendly",
              cardType: "unit",
              state: "active",
              hasKeyword: "Blocker",
              count: 1,
            },
          },
        },
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 4,
                },
              ],
              count: 1,
            },
          },
          sharesTargetChoiceWithPrevious: true,
        },
      ],
      sourceText:
        "【When Paired】Choose 1 active friendly Unit with <Blocker> and 1 enemy Unit that is Lv.4 or lower. Rest them.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
