import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd05HokaKyotenJuzetsujin112: CommandCard = {
  cardNumber: "GD05-112",
  name: "Hoka Kyoten Juzetsujin",
  type: "command",
  color: "red",
  traits: ["gundam fighter", "shuffle alliance", "special move"],
  id: "GD05-112",
  canonicalId: "GD05-112",
  externalIds: { bandai: "gundam:gd05-112" },
  slug: "hoka-kyoten-juzetsujin-gd05-112",
  displayName: "Hoka Kyoten Juzetsujin",
  rulesText:
    "【Main】Choose 1 of your (MF) Units without <Breach>. It gains <Breach 3> during this turn. After activating this card's 【Main】, you may pair this card from your trash with one of your (MF) Units.\n【Pilot】[Sai Saici]",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-112",
  printings: [
    {
      id: "GD05-112",
      artId: "GD05-112",
      setCode: "GD05",
      collectorNumber: "GD05-112",
      cardNumber: "GD05-112",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-112.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-112",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-112.webp",
  legality: "legal",
  sourceTitle: "Mobile Fighter G Gundam",
  level: 4,
  cost: 1,
  pilotName: "Sai Saici",
  apBonus: 2,
  hpBonus: 0,
  effect:
    "【Main】Choose 1 of your (MF) Units without <Breach>. It gains <Breach 3> during this turn. After activating this card's 【Main】, you may pair this card from your trash with one of your (MF) Units.\n【Pilot】[Sai Saici]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Breach",
            keywordValue: 3,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "mf",
                },
              ],
              lacksKeyword: "Breach",
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
        "【Main】Choose 1 of your (MF) Units without <Breach>. It gains <Breach 3> during this turn. After activating this card's 【Main】, you may pair this card from your trash with one of your (MF) Units.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
