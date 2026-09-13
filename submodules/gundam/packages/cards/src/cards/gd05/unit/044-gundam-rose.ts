import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05GundamRose044: UnitCard = {
  cardNumber: "GD05-044",
  name: "Gundam Rose",
  type: "unit",
  color: "red",
  traits: ["mf", "shuffle alliance"],
  id: "GD05-044",
  canonicalId: "GD05-044",
  externalIds: { bandai: "gundam:gd05-044" },
  slug: "gundam-rose-gd05-044",
  displayName: "Gundam Rose",
  rulesText: "【During Link】【Attack】Activate 【Main】 on the card paired with this Unit.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-044",
  printings: [
    {
      id: "GD05-044",
      artId: "GD05-044",
      setCode: "GD05",
      collectorNumber: "GD05-044",
      cardNumber: "GD05-044",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-044.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-044",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-044.webp",
  legality: "legal",
  sourceTitle: "Mobile Fighter G Gundam",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 3,
  linkCondition: "[George de Sand]",
  battlefieldZones: ["space", "earth"],
  effect: "【During Link】【Attack】Activate 【Main】 on the card paired with this Unit.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          {
            type: "duringLink",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "activatePairedCardTiming",
            timing: "main",
          },
        },
      ],
      sourceText: "【During Link】【Attack】Activate 【Main】 on the card paired with this Unit.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
