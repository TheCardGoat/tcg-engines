import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const eb01ChallAcustica068: PilotCard = {
  cardNumber: "EB01-068",
  name: "Chall Acustica",
  type: "pilot",
  color: "green",
  traits: ["g generation", "attack"],
  id: "EB01-068",
  canonicalId: "EB01-068",
  externalIds: { bandai: "gundam:eb01-068" },
  slug: "chall-acustica-eb01-068",
  displayName: "Chall Acustica",
  rulesText:
    "【Burst】Add this card to your hand.\n【During Link】【Destroyed】You may return the card paired with this Unit to the top of its owner's deck.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-068",
  printings: [
    {
      id: "EB01-068",
      artId: "EB01-068",
      setCode: "EB01",
      collectorNumber: "EB01-068",
      cardNumber: "EB01-068",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-068.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-068",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-068.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 1,
  apBonus: 1,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.\n【During Link】【Destroyed】You may return the card paired with this Unit to the top of its owner's deck.",
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
        timing: ["destroyed"],
        conditions: [
          {
            type: "duringLink",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "returnPairedCardToDeck",
            position: "top",
          },
          optional: true,
        },
      ],
      sourceText:
        "【During Link】【Destroyed】You may return the card paired with this Unit to the top of its owner's deck.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
