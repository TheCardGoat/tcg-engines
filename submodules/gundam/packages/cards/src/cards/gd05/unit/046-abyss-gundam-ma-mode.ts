import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05AbyssGundamMaMode046: UnitCard = {
  cardNumber: "GD05-046",
  name: "Abyss Gundam (MA Mode)",
  type: "unit",
  color: "red",
  traits: ["earth alliance", "phantom pain"],
  id: "GD05-046",
  canonicalId: "GD05-046",
  externalIds: { bandai: "gundam:gd05-046" },
  slug: "abyss-gundam-ma-mode-gd05-046",
  displayName: "Abyss Gundam (MA Mode)",
  rulesText:
    "【When Paired･(Phantom Pain) Pilot】Choose 1 enemy player with 4 or more cards in their hand. They discard 1.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-046",
  printings: [
    {
      id: "GD05-046",
      artId: "GD05-046",
      setCode: "GD05",
      collectorNumber: "GD05-046",
      cardNumber: "GD05-046",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-046.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-046",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-046.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam SEED Destiny",
  level: 4,
  cost: 2,
  ap: 3,
  hp: 3,
  linkCondition: "[Auel Neider]",
  battlefieldZones: ["earth"],
  effect:
    "【When Paired･(Phantom Pain) Pilot】Choose 1 enemy player with 4 or more cards in their hand. They discard 1.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
        qualification: {
          attribute: "trait",
          comparison: "includes",
          value: "phantom pain",
        },
        conditions: [
          {
            type: "handCount",
            owner: "opponent",
            comparison: "gte",
            count: 4,
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
              directives: [{ action: { action: "discard", count: 1 } }],
              sourceText: "Choose 1 card from your hand to discard.",
            },
          },
        },
      ],
      sourceText:
        "【When Paired·(Phantom Pain) Pilot】Choose 1 enemy player with 4 or more cards in their hand. They discard 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
