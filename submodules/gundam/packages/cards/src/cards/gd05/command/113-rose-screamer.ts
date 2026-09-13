import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd05RoseScreamer113: CommandCard = {
  cardNumber: "GD05-113",
  name: "Rose Screamer",
  type: "command",
  color: "red",
  traits: ["gundam fighter", "shuffle alliance", "special move"],
  id: "GD05-113",
  canonicalId: "GD05-113",
  externalIds: { bandai: "gundam:gd05-113" },
  slug: "rose-screamer-gd05-113",
  displayName: "Rose Screamer",
  rulesText:
    "【Main】Choose 1 of your (MF) Units with 4 or less AP. It gets AP+2 during this turn. After activating this card's 【Main】, you may pair this card from your trash with one of your (MF) Units.\n【Pilot】[George de Sand]",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-113",
  printings: [
    {
      id: "GD05-113",
      artId: "GD05-113",
      setCode: "GD05",
      collectorNumber: "GD05-113",
      cardNumber: "GD05-113",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-113.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-113",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-113.webp",
  legality: "legal",
  sourceTitle: "Mobile Fighter G Gundam",
  level: 3,
  cost: 1,
  pilotName: "George de Sand",
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Main】Choose 1 of your (MF) Units with 4 or less AP. It gets AP+2 during this turn. After activating this card's 【Main】, you may pair this card from your trash with one of your (MF) Units.\n【Pilot】[George de Sand]",
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
            amount: 2,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "ap",
                  comparison: "lte",
                  value: 4,
                },
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "mf",
                },
              ],
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
        "【Main】Choose 1 of your (MF) Units with 4 or less AP. It gets AP+2 during this turn. After activating this card's 【Main】, you may pair this card from your trash with one of your (MF) Units.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
