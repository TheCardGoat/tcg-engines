import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd05CagalliYulaAthha083: PilotCard = {
  cardNumber: "GD05-083",
  name: "Cagalli Yula Athha",
  type: "pilot",
  color: "blue",
  traits: ["orb"],
  id: "GD05-083",
  canonicalId: "GD05-083",
  externalIds: { bandai: "gundam:gd05-083" },
  slug: "cagalli-yula-athha-gd05-083",
  displayName: "Cagalli Yula Athha",
  rulesText:
    "【Burst】Add this card to your hand.\n【When Paired】Choose 1 enemy Unit with 1 HP. Return it to its owner's hand.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-083",
  printings: [
    {
      id: "GD05-083",
      artId: "GD05-083",
      setCode: "GD05",
      collectorNumber: "GD05-083",
      cardNumber: "GD05-083",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-083.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-083",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-083.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam SEED Destiny",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【When Paired】Choose 1 enemy Unit with 1 HP. Return it to its owner's hand.",
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
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "hp", comparison: "lte", value: 1 }],
            },
          },
        },
      ],
      sourceText: "【When Paired】Choose 1 enemy Unit with 1 HP. Return it to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
