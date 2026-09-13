import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05BoltGundam076: UnitCard = {
  cardNumber: "GD05-076",
  name: "Bolt Gundam",
  type: "unit",
  color: "white",
  traits: ["mf", "shuffle alliance"],
  id: "GD05-076",
  canonicalId: "GD05-076",
  externalIds: { bandai: "gundam:gd05-076" },
  slug: "bolt-gundam-gd05-076",
  displayName: "Bolt Gundam",
  rulesText: "【During Link】【Attack】Activate 【Main】 on the card paired with this Unit.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-076",
  printings: [
    {
      id: "GD05-076",
      artId: "GD05-076",
      setCode: "GD05",
      collectorNumber: "GD05-076",
      cardNumber: "GD05-076",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-076.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-076",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-076.webp",
  legality: "legal",
  sourceTitle: "Mobile Fighter G Gundam",
  level: 4,
  cost: 2,
  ap: 4,
  hp: 3,
  linkCondition: "[Argo Gulskii]",
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
