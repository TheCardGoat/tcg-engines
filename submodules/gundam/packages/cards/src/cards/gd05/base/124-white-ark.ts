import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd05WhiteArk124: BaseCard = {
  cardNumber: "GD05-124",
  name: "White Ark",
  type: "base",
  color: "blue",
  traits: ["league militaire", "warship"],
  id: "GD05-124",
  canonicalId: "GD05-124",
  externalIds: { bandai: "gundam:gd05-124" },
  slug: "white-ark-gd05-124",
  displayName: "White Ark",
  rulesText:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\nDuring your turn, when you would rest a Unit with a friendly (League Militaire) Unit's effect, you may rest this Base instead.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-124",
  printings: [
    {
      id: "GD05-124",
      artId: "GD05-124",
      setCode: "GD05",
      collectorNumber: "GD05-124",
      cardNumber: "GD05-124",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-124.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-124",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-124.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit V Gundam",
  level: 2,
  cost: 1,
  hp: 5,
  battlefieldZones: ["space", "earth"],
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\nDuring your turn, when you would rest a Unit with a friendly (League Militaire) Unit's effect, you may rest this Base instead.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "deploySelf",
          },
        },
      ],
      sourceText: "【Burst】Deploy this card.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "addShieldToHand",
            count: 1,
          },
        },
      ],
      sourceText: "【Deploy】Add 1 of your Shields to your hand.",
    },
    {
      type: "substitution",
      activation: {
        conditions: [
          {
            type: "isTurn",
            whose: "friendly",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "substituteUnitRestWithSelf",
            sourceUnitTrait: "league militaire",
          },
        },
      ],
      sourceText:
        "During your turn, when you would rest a Unit with a friendly (League Militaire) Unit's effect, you may rest this Base instead.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
