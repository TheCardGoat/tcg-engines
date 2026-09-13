import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const eb01FierceEnemyAssault075: CommandCard = {
  cardNumber: "EB01-075",
  name: "Fierce Enemy Assault",
  type: "command",
  color: "blue",
  traits: [],
  id: "EB01-075",
  canonicalId: "EB01-075",
  externalIds: { bandai: "gundam:eb01-075" },
  slug: "fierce-enemy-assault-eb01-075",
  displayName: "Fierce Enemy Assault",
  rulesText: "【Main】/【Action】Choose 1 to 2 enemy Units with 2 or less HP. Rest them.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-075",
  printings: [
    {
      id: "EB01-075",
      artId: "EB01-075",
      setCode: "EB01",
      collectorNumber: "EB01-075",
      cardNumber: "EB01-075",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-075.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-075",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-075.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 3,
  cost: 1,
  effect: "【Main】/【Action】Choose 1 to 2 enemy Units with 2 or less HP. Rest them.",
  effects: [
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
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "hp",
                  comparison: "lte",
                  value: 2,
                },
              ],
              count: {
                min: 1,
                max: 2,
              },
            },
          },
        },
      ],
      sourceText: "【Main】/【Action】Choose 1 to 2 enemy Units with 2 or less HP. Rest them.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
