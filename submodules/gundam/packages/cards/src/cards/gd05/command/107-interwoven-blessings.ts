import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd05InterwovenBlessings107: CommandCard = {
  cardNumber: "GD05-107",
  name: "Interwoven Blessings",
  type: "command",
  color: "green",
  traits: [],
  id: "GD05-107",
  canonicalId: "GD05-107",
  externalIds: { bandai: "gundam:gd05-107" },
  slug: "interwoven-blessings-gd05-107",
  displayName: "Interwoven Blessings",
  rulesText:
    "【Burst】Place 1 EX Resource.\n【Main】Choose 1 enemy player. Destroy the first 2 cards in that player's shield area.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-107",
  printings: [
    {
      id: "GD05-107",
      artId: "GD05-107",
      setCode: "GD05",
      collectorNumber: "GD05-107",
      cardNumber: "GD05-107",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-107.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-107",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-107.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  level: 10,
  cost: 10,
  effect:
    "【Burst】Place 1 EX Resource.\n【Main】Choose 1 enemy player. Destroy the first 2 cards in that player's shield area.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "placeExResource",
            state: "active",
          },
        },
      ],
      sourceText: "【Burst】Place 1 EX Resource.",
    },
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "destroyTopOpponentShields",
            count: 2,
          },
        },
      ],
      sourceText:
        "【Main】Choose 1 enemy player. Destroy the first 2 cards in that player's shield area.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
