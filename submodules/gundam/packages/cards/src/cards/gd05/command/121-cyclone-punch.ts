import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd05CyclonePunch121: CommandCard = {
  cardNumber: "GD05-121",
  name: "Cyclone Punch",
  type: "command",
  color: "white",
  traits: ["gundam fighter", "shuffle alliance", "special move"],
  id: "GD05-121",
  canonicalId: "GD05-121",
  externalIds: { bandai: "gundam:gd05-121" },
  slug: "cyclone-punch-gd05-121",
  displayName: "Cyclone Punch",
  rulesText:
    "【Main】Choose 1 enemy Unit. It gets AP-2 during this turn. After activating this card's 【Main】, you may pair this card from your trash with one of your (MF) Units.\n【Pilot】[Chibodee Crocket]",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-121",
  printings: [
    {
      id: "GD05-121",
      artId: "GD05-121",
      setCode: "GD05",
      collectorNumber: "GD05-121",
      cardNumber: "GD05-121",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-121.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-121",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-121.webp",
  legality: "legal",
  sourceTitle: "Mobile Fighter G Gundam",
  level: 3,
  cost: 1,
  pilotName: "Chibodee Crocket",
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Main】Choose 1 enemy Unit. It gets AP-2 during this turn. After activating this card's 【Main】, you may pair this card from your trash with one of your (MF) Units.\n【Pilot】[Chibodee Crocket]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -2,
            duration: "thisTurn",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      afterResolution: [
        {
          action: {
            action: "pairSourceFromZone",
            requiredZone: "trash",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "mf" }],
            },
          },
          optional: true,
        },
      ],
      sourceText:
        "【Main】Choose 1 enemy Unit. It gets AP-2 during this turn. After activating this card's 【Main】, you may pair this card from your trash with one of your (MF) Units.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
