import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const eb01EllisClaude061: PilotCard = {
  cardNumber: "EB01-061",
  name: "Ellis Claude",
  type: "pilot",
  color: "blue",
  traits: ["g generation", "support"],
  id: "EB01-061",
  canonicalId: "EB01-061",
  externalIds: { bandai: "gundam:eb01-061" },
  slug: "ellis-claude-eb01-061",
  displayName: "Ellis Claude",
  rulesText:
    "【Burst】Add this card to your hand.\n【When Paired】If a friendly (G Generation) Unit is in play, choose 1 enemy Unit that is Lv.3 or lower. Rest it.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-061",
  printings: [
    {
      id: "EB01-061",
      artId: "EB01-061",
      setCode: "EB01",
      collectorNumber: "EB01-061",
      cardNumber: "EB01-061",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-061.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-061",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-061.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【When Paired】If a friendly (G Generation) Unit is in play, choose 1 enemy Unit that is Lv.3 or lower. Rest it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "addSelfToHand",
          },
        },
      ],
      sourceText: "【Burst】Add this card to your hand.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: "g generation",
          },
        ],
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
                  value: 3,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【When Paired】If a friendly (G Generation) Unit is in play, choose 1 enemy Unit that is Lv.3 or lower. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
