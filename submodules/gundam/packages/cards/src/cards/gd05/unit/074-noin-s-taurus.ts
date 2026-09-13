import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05NoinSTaurus074: UnitCard = {
  cardNumber: "GD05-074",
  name: "Noin's Taurus",
  type: "unit",
  color: "white",
  traits: ["preventer"],
  id: "GD05-074",
  canonicalId: "GD05-074",
  externalIds: { bandai: "gundam:gd05-074" },
  slug: "noin-s-taurus-gd05-074",
  displayName: "Noin's Taurus",
  rulesText: "【Destroyed】Draw 1. Then, discard 1.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-074",
  printings: [
    {
      id: "GD05-074",
      artId: "GD05-074",
      setCode: "GD05",
      collectorNumber: "GD05-074",
      cardNumber: "GD05-074",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-074.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-074",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-074.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam Wing: Endless Waltz",
  level: 2,
  cost: 2,
  ap: 3,
  hp: 1,
  linkCondition: "(Preventer) Trait / [Lucrezia Noin]",
  battlefieldZones: ["space", "earth"],
  effect: "【Destroyed】Draw 1. Then, discard 1.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
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
      sourceText: "【Destroyed】Draw 1. Then, discard 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
