import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd05QuatreRaberbaWinner100: PilotCard = {
  cardNumber: "GD05-100",
  name: "Quatre Raberba Winner",
  type: "pilot",
  color: "white",
  traits: ["g team", "operation meteor"],
  id: "GD05-100",
  canonicalId: "GD05-100",
  externalIds: { bandai: "gundam:gd05-100" },
  slug: "quatre-raberba-winner-gd05-100",
  displayName: "Quatre Raberba Winner",
  rulesText:
    "【Burst】Add this card to your hand.\n【When Paired】Choose 1 enemy Unit that is Lv.5 or lower. Rest it.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-100",
  printings: [
    {
      id: "GD05-100",
      artId: "GD05-100",
      setCode: "GD05",
      collectorNumber: "GD05-100",
      cardNumber: "GD05-100",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-100.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-100",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-100.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam Wing: Endless Waltz",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【When Paired】Choose 1 enemy Unit that is Lv.5 or lower. Rest it.",
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
                  value: 5,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText: "【When Paired】Choose 1 enemy Unit that is Lv.5 or lower. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
