import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05ReGzBws023: UnitCard = {
  cardNumber: "GD05-023",
  name: "Re-GZ BWS",
  type: "unit",
  color: "green",
  traits: ["earth federation", "londo bell"],
  id: "GD05-023",
  canonicalId: "GD05-023",
  externalIds: { bandai: "gundam:gd05-023" },
  slug: "re-gz-bws-gd05-023",
  displayName: "Re-GZ BWS",
  rulesText: "【Deploy】Place 1 EX Resource.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-023",
  printings: [
    {
      id: "GD05-023",
      artId: "GD05-023",
      setCode: "GD05",
      collectorNumber: "GD05-023",
      cardNumber: "GD05-023",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-023.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-023",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-023.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Char's Counterattack",
  level: 3,
  cost: 3,
  ap: 2,
  hp: 2,
  linkCondition: "(Londo Bell) Trait / [Amuro Ray]",
  battlefieldZones: ["space", "earth"],
  effect: "【Deploy】Place 1 EX Resource.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "placeExResource",
            state: "active",
          },
        },
      ],
      sourceText: "【Deploy】Place 1 EX Resource.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
