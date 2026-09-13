import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd05TrowaBarton099: PilotCard = {
  cardNumber: "GD05-099",
  name: "Trowa Barton",
  type: "pilot",
  color: "white",
  traits: ["g team", "operation meteor"],
  id: "GD05-099",
  canonicalId: "GD05-099",
  externalIds: { bandai: "gundam:gd05-099" },
  slug: "trowa-barton-gd05-099",
  displayName: "Trowa Barton",
  rulesText:
    "【Burst】Add this card to your hand.\nDuring your turn, when this Unit destroys an enemy Unit with battle damage, draw 1. Then, discard 1.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-099",
  printings: [
    {
      id: "GD05-099",
      artId: "GD05-099",
      setCode: "GD05",
      collectorNumber: "GD05-099",
      cardNumber: "GD05-099",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-099.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-099",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-099.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam Wing: Endless Waltz",
  level: 4,
  cost: 1,
  apBonus: 1,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.\nDuring your turn, when this Unit destroys an enemy Unit with battle damage, draw 1. Then, discard 1.",
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
        timing: ["onDestroyByBattle"],
        conditions: [
          {
            type: "isTurn",
            whose: "friendly",
          },
          {
            type: "eventCardIsSelf",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "drawThenDiscard",
            drawCount: 1,
            discardCount: 1,
          },
        },
      ],
      sourceText:
        "During your turn, when this Unit destroys an enemy Unit with battle damage, draw 1. Then, discard 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
