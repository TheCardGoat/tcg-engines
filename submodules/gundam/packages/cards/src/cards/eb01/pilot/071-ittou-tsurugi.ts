import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const eb01IttouTsurugi071: PilotCard = {
  cardNumber: "EB01-071",
  name: "Ittou Tsurugi",
  type: "pilot",
  color: "white",
  traits: ["g generation", "attack"],
  id: "EB01-071",
  canonicalId: "EB01-071",
  externalIds: { bandai: "gundam:eb01-071" },
  slug: "ittou-tsurugi-eb01-071",
  displayName: "Ittou Tsurugi",
  rulesText: "【Burst】Add this card to your hand.\n【During Link】This Unit gets AP+1.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-071",
  printings: [
    {
      id: "EB01-071",
      artId: "EB01-071",
      setCode: "EB01",
      collectorNumber: "EB01-071",
      cardNumber: "EB01-071",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-071.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-071",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-071.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect: "【Burst】Add this card to your hand.\n【During Link】This Unit gets AP+1.",
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
      type: "constant",
      activation: {
        conditions: [
          {
            type: "duringLink",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText: "【During Link】This Unit gets AP+1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
