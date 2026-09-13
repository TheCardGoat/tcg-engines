import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01Darilbalde036: UnitCard = {
  cardNumber: "EB01-036",
  name: "Darilbalde",
  type: "unit",
  color: "green",
  traits: ["g generation"],
  id: "EB01-036",
  canonicalId: "EB01-036",
  externalIds: { bandai: "gundam:eb01-036" },
  slug: "darilbalde-eb01-036",
  displayName: "Darilbalde",
  rulesText: "During your turn, all other (G Generation) Units that are Lv.3 get AP+1.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-036",
  printings: [
    {
      id: "EB01-036",
      artId: "EB01-036",
      setCode: "EB01",
      collectorNumber: "EB01-036",
      cardNumber: "EB01-036",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-036.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-036",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-036.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 3,
  cost: 3,
  ap: 4,
  hp: 3,
  battlefieldZones: ["space", "earth"],
  effect: "During your turn, all other (G Generation) Units that are Lv.3 get AP+1.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "isTurn",
            whose: "friendly",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "permanent",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: "all",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "g generation",
                },
                {
                  attribute: "level",
                  comparison: "eq",
                  value: 3,
                },
              ],
              excludeSource: true,
            },
          },
        },
      ],
      sourceText: "During your turn, all other (G Generation) Units that are Lv.3 get AP+1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
