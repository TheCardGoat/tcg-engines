import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd05GravitonHammer122: CommandCard = {
  cardNumber: "GD05-122",
  name: "Graviton Hammer",
  type: "command",
  color: "white",
  traits: ["gundam fighter", "shuffle alliance", "special move"],
  id: "GD05-122",
  canonicalId: "GD05-122",
  externalIds: { bandai: "gundam:gd05-122" },
  slug: "graviton-hammer-gd05-122",
  displayName: "Graviton Hammer",
  rulesText:
    "【Main】Choose 1 enemy Unit that is Lv.4 or lower. Rest it. After activating this card's 【Main】, you may pair this card from your trash with one of your (MF) Units.\n【Pilot】[Argo Gulskii]",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-122",
  printings: [
    {
      id: "GD05-122",
      artId: "GD05-122",
      setCode: "GD05",
      collectorNumber: "GD05-122",
      cardNumber: "GD05-122",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-122.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-122",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-122.webp",
  legality: "legal",
  sourceTitle: "Mobile Fighter G Gundam",
  level: 4,
  cost: 1,
  pilotName: "Argo Gulskii",
  apBonus: 0,
  hpBonus: 2,
  effect:
    "【Main】Choose 1 enemy Unit that is Lv.4 or lower. Rest it. After activating this card's 【Main】, you may pair this card from your trash with one of your (MF) Units.\n【Pilot】[Argo Gulskii]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 4,
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
        "【Main】Choose 1 enemy Unit that is Lv.4 or lower. Rest it. After activating this card's 【Main】, you may pair this card from your trash with one of your (MF) Units.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
