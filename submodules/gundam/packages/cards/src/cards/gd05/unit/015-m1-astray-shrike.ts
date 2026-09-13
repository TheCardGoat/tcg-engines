import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05M1AstrayShrike015: UnitCard = {
  cardNumber: "GD05-015",
  name: "M1 Astray Shrike",
  type: "unit",
  color: "blue",
  traits: ["orb"],
  id: "GD05-015",
  canonicalId: "GD05-015",
  externalIds: { bandai: "gundam:gd05-015" },
  slug: "m1-astray-shrike-gd05-015",
  displayName: "M1 Astray Shrike",
  rulesText: "【Deploy】Choose 1 rested enemy Unit. Deal 1 damage to it.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-015",
  printings: [
    {
      id: "GD05-015",
      artId: "GD05-015",
      setCode: "GD05",
      collectorNumber: "GD05-015",
      cardNumber: "GD05-015",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-015.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-015",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-015.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam SEED Destiny",
  level: 2,
  cost: 1,
  ap: 1,
  hp: 2,
  battlefieldZones: ["space", "earth"],
  effect: "【Deploy】Choose 1 rested enemy Unit. Deal 1 damage to it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              state: "rested",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Deploy】Choose 1 rested enemy Unit. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
