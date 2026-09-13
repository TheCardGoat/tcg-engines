import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd05StingOakley091: PilotCard = {
  cardNumber: "GD05-091",
  name: "Sting Oakley",
  type: "pilot",
  color: "red",
  traits: ["earth alliance", "phantom pain", "biological cpu"],
  id: "GD05-091",
  canonicalId: "GD05-091",
  externalIds: { bandai: "gundam:gd05-091" },
  slug: "sting-oakley-gd05-091",
  displayName: "Sting Oakley",
  rulesText:
    "【Burst】Add this card to your hand.\nWhile an enemy player has 7 or more cards in their trash, this Unit gets AP+1 and HP+1.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-091",
  printings: [
    {
      id: "GD05-091",
      artId: "GD05-091",
      setCode: "GD05",
      collectorNumber: "GD05-091",
      cardNumber: "GD05-091",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-091.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-091",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-091.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam SEED Destiny",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\nWhile an enemy player has 7 or more cards in their trash, this Unit gets AP+1 and HP+1.",
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
            type: "cardInZone",
            owner: "opponent",
            zone: "trash",
            comparison: "gte",
            count: 7,
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
        {
          action: {
            action: "statModifier",
            stat: "hp",
            amount: 1,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "While an enemy player has 7 or more cards in their trash, this Unit gets AP+1 and HP+1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
