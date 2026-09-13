import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd05FelsiSPlea109: CommandCard = {
  cardNumber: "GD05-109",
  name: "Felsi's Plea",
  type: "command",
  color: "green",
  traits: ["academy"],
  id: "GD05-109",
  canonicalId: "GD05-109",
  externalIds: { bandai: "gundam:gd05-109" },
  slug: "felsi-s-plea-gd05-109",
  displayName: "Felsi's Plea",
  rulesText:
    "【Action】Choose 1 friendly (Academy) Unit. It recovers 2 HP. Then, if it is paired with a Pilot that is Lv.3 or lower, draw 1.\n【Pilot】[Felsi Rollo]",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-109",
  printings: [
    {
      id: "GD05-109",
      artId: "GD05-109",
      setCode: "GD05",
      collectorNumber: "GD05-109",
      cardNumber: "GD05-109",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-109.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-109",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-109.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  level: 3,
  cost: 1,
  pilotName: "Felsi Rollo",
  apBonus: 0,
  hpBonus: 1,
  effect:
    "【Action】Choose 1 friendly (Academy) Unit. It recovers 2 HP. Then, if it is paired with a Pilot that is Lv.3 or lower, draw 1.\n【Pilot】[Felsi Rollo]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["action"],
      },
      directives: [
        {
          action: {
            action: "recoverHP",
            amount: 2,
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "academy",
                },
              ],
              count: 1,
            },
          },
        },
        {
          action: {
            action: "drawIfTargetMatches",
            count: 1,
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "academy",
                },
                {
                  attribute: "pairedPilotLevel",
                  comparison: "lte",
                  value: 3,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Action】Choose 1 friendly (Academy) Unit. It recovers 2 HP. Then, if it is paired with a Pilot that is Lv.3 or lower, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
