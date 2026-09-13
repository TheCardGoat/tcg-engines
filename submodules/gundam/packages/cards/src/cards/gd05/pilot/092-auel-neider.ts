import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd05AuelNeider092: PilotCard = {
  cardNumber: "GD05-092",
  name: "Auel Neider",
  type: "pilot",
  color: "red",
  traits: ["earth alliance", "phantom pain", "biological cpu"],
  id: "GD05-092",
  canonicalId: "GD05-092",
  externalIds: { bandai: "gundam:gd05-092" },
  slug: "auel-neider-gd05-092",
  displayName: "Auel Neider",
  rulesText:
    "【Burst】Add this card to your hand.\n【During Link】【Attack】If you are attacking the enemy player, this Unit gets AP+2 during this battle.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-092",
  printings: [
    {
      id: "GD05-092",
      artId: "GD05-092",
      setCode: "GD05",
      collectorNumber: "GD05-092",
      cardNumber: "GD05-092",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-092.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-092",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-092.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam SEED Destiny",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【During Link】【Attack】If you are attacking the enemy player, this Unit gets AP+2 during this battle.",
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
        conditions: [
          {
            type: "duringLink",
          },
          {
            type: "isAttackingPlayer",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "thisBattle",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "【During Link】【Attack】If you are attacking the enemy player, this Unit gets AP+2 during this battle.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
