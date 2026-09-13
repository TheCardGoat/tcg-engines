import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const eb01BesidePain069: PilotCard = {
  cardNumber: "EB01-069",
  name: "Beside Pain",
  type: "pilot",
  color: "white",
  traits: ["g generation", "durability"],
  id: "EB01-069",
  canonicalId: "EB01-069",
  externalIds: { bandai: "gundam:eb01-069" },
  slug: "beside-pain-eb01-069",
  displayName: "Beside Pain",
  rulesText:
    "【Burst】Add this card to your hand.\n【Attack】Choose 1 friendly Unit with <Blocker>. It gets AP+2 during this turn.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-069",
  printings: [
    {
      id: "EB01-069",
      artId: "EB01-069",
      setCode: "EB01",
      collectorNumber: "EB01-069",
      cardNumber: "EB01-069",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-069.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-069",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-069.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【Attack】Choose 1 friendly Unit with <Blocker>. It gets AP+2 during this turn.",
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
            amount: 2,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              hasKeyword: "Blocker",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Attack】Choose 1 friendly Unit with <Blocker>. It gets AP+2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
