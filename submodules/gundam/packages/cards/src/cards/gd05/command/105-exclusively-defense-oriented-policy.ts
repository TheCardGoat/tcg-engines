import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd05ExclusivelyDefenseOrientedPolicy105: CommandCard = {
  cardNumber: "GD05-105",
  name: "Exclusively Defense-Oriented Policy",
  type: "command",
  color: "blue",
  traits: [],
  id: "GD05-105",
  canonicalId: "GD05-105",
  externalIds: { bandai: "gundam:gd05-105" },
  slug: "exclusively-defense-oriented-policy-gd05-105",
  displayName: "Exclusively Defense-Oriented Policy",
  rulesText:
    "【Burst】Activate this card's 【Main】.\n【Main】/【Action】Choose 1 enemy Unit that is Lv.3 or lower. Return it to its owner's hand.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-105",
  printings: [
    {
      id: "GD05-105",
      artId: "GD05-105",
      setCode: "GD05",
      collectorNumber: "GD05-105",
      cardNumber: "GD05-105",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-105.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-105",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-105.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam SEED Destiny",
  level: 2,
  cost: 1,
  effect:
    "【Burst】Activate this card's 【Main】.\n【Main】/【Action】Choose 1 enemy Unit that is Lv.3 or lower. Return it to its owner's hand.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "activateTiming",
            timing: "main",
          },
        },
      ],
      sourceText: "【Burst】Activate this card's 【Main】.",
    },
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
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
        "【Main】/【Action】Choose 1 enemy Unit that is Lv.3 or lower. Return it to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
