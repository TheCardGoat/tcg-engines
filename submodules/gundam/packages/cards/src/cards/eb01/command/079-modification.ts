import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const eb01Modification079: CommandCard = {
  cardNumber: "EB01-079",
  name: "Modification",
  type: "command",
  color: "green",
  traits: [],
  id: "EB01-079",
  canonicalId: "EB01-079",
  externalIds: { bandai: "gundam:eb01-079" },
  slug: "modification-eb01-079",
  displayName: "Modification",
  rulesText:
    "【Main】Choose 1 friendly (G Generation) Unit. It can't receive battle damage from enemy Units that are Lv.3 or lower during this turn.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-079",
  printings: [
    {
      id: "EB01-079",
      artId: "EB01-079",
      setCode: "EB01",
      collectorNumber: "EB01-079",
      cardNumber: "EB01-079",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-079.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-079",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-079.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 3,
  cost: 1,
  effect:
    "【Main】Choose 1 friendly (G Generation) Unit. It can't receive battle damage from enemy Units that are Lv.3 or lower during this turn.",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "preventDamage",
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
            unitFilter: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
            damageType: "battle",
            duration: "thisTurn",
          },
        },
      ],
      sourceText:
        "【Main】Choose 1 friendly (G Generation) Unit. It can't receive battle damage from enemy Units that are Lv.3 or lower during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
