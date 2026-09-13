import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const eb01EternalRoad074: CommandCard = {
  cardNumber: "EB01-074",
  name: "Eternal Road",
  type: "command",
  color: "blue",
  traits: [],
  id: "EB01-074",
  canonicalId: "EB01-074",
  externalIds: { bandai: "gundam:eb01-074" },
  slug: "eternal-road-eb01-074",
  displayName: "Eternal Road",
  rulesText:
    "【Burst】Choose 1 enemy Unit with 3 or less HP. Rest it.\n【Main】/【Action】Choose 1 active friendly (G Generation) Unit. Rest it. If you do, all enemy players each choose 1 of their active Units. Rest them.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-074",
  printings: [
    {
      id: "EB01-074",
      artId: "EB01-074",
      setCode: "EB01",
      collectorNumber: "EB01-074",
      cardNumber: "EB01-074",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-074.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-074",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-074.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 3,
  cost: 1,
  effect:
    "【Burst】Choose 1 enemy Unit with 3 or less HP. Rest it.\n【Main】/【Action】Choose 1 active friendly (G Generation) Unit. Rest it. If you do, all enemy players each choose 1 of their active Units. Rest them.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
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
                  attribute: "hp",
                  comparison: "lte",
                  value: 3,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Burst】Choose 1 enemy Unit with 3 or less HP. Rest it.",
    },
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "friendly",
              cardType: "unit",
              state: "active",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "g generation",
                },
              ],
              count: 1,
            },
          },
        },
        {
          action: {
            action: "queueEffectForPlayers",
            scope: "opponents",
            effect: {
              type: "triggered",
              activation: { timing: [] },
              directives: [
                {
                  action: {
                    action: "rest",
                    target: {
                      owner: "friendly",
                      cardType: "unit",
                      state: "active",
                      count: 1,
                    },
                  },
                },
              ],
              sourceText: "Choose 1 of your active Units. Rest it.",
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 active friendly (G Generation) Unit. Rest it. If you do, all enemy players each choose 1 of their active Units. Rest them.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
