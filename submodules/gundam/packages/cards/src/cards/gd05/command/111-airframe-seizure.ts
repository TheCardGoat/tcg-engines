import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd05AirframeSeizure111: CommandCard = {
  cardNumber: "GD05-111",
  name: "Airframe​ Seizure",
  type: "command",
  color: "red",
  traits: [],
  id: "GD05-111",
  canonicalId: "GD05-111",
  externalIds: { bandai: "gundam:gd05-111" },
  slug: "airframe-seizure-gd05-111",
  displayName: "Airframe​ Seizure",
  rulesText: "【Main】Discard 1. If you do, draw 2.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-111",
  printings: [
    {
      id: "GD05-111",
      artId: "GD05-111",
      setCode: "GD05",
      collectorNumber: "GD05-111",
      cardNumber: "GD05-111",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-111.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-111",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-111.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam SEED Destiny",
  level: 1,
  cost: 1,
  effect: "【Main】Discard 1. If you do, draw 2.",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "discard",
            count: 1,
          },
        },
        {
          action: {
            action: "draw",
            count: 2,
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText: "【Main】Discard 1. If you do, draw 2.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
