import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const eb01SturmFaust080: CommandCard = {
  cardNumber: "EB01-080",
  name: "Sturm Faust",
  type: "command",
  color: "green",
  traits: ["g generation", "support"],
  id: "EB01-080",
  canonicalId: "EB01-080",
  externalIds: { bandai: "gundam:eb01-080" },
  slug: "sturm-faust-eb01-080",
  displayName: "Sturm Faust",
  rulesText:
    "【Main】/【Action】Choose 1 (G Generation) Unit. During this turn, it may choose an active enemy Unit as its attack target.\n【Pilot】[Jean Luc Duvall]",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-080",
  printings: [
    {
      id: "EB01-080",
      artId: "EB01-080",
      setCode: "EB01",
      collectorNumber: "EB01-080",
      cardNumber: "EB01-080",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-080.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-080",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-080.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 1,
  pilotName: "Jean Luc Duvall",
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Main】/【Action】Choose 1 (G Generation) Unit. During this turn, it may choose an active enemy Unit as its attack target.\n【Pilot】[Jean Luc Duvall]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: {
              owner: "any",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "g generation",
                },
              ],
              count: 1,
            },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
            },
            duration: "thisTurn",
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 (G Generation) Unit. During this turn, it may choose an active enemy Unit as its attack target.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
