import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const eb01GerberaStraight076: CommandCard = {
  cardNumber: "EB01-076",
  name: "Gerbera Straight",
  type: "command",
  color: "blue",
  traits: ["g generation", "durability"],
  id: "EB01-076",
  canonicalId: "EB01-076",
  externalIds: { bandai: "gundam:eb01-076" },
  slug: "gerbera-straight-eb01-076",
  displayName: "Gerbera Straight",
  rulesText:
    "【Main】/【Action】Choose 1 friendly (G Generation) Unit. It recovers 3 HP.\n【Pilot】[Lowe Guele]",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-076",
  printings: [
    {
      id: "EB01-076",
      artId: "EB01-076",
      setCode: "EB01",
      collectorNumber: "EB01-076",
      cardNumber: "EB01-076",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-076.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-076",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-076.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 1,
  pilotName: "Lowe Guele",
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Main】/【Action】Choose 1 friendly (G Generation) Unit. It recovers 3 HP.\n【Pilot】[Lowe Guele]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "recoverHP",
            amount: 3,
            target: {
              owner: "friendly",
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
          },
        },
      ],
      sourceText: "【Main】/【Action】Choose 1 friendly (G Generation) Unit. It recovers 3 HP.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
