import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const eb01MapWeapon081: CommandCard = {
  cardNumber: "EB01-081",
  name: "MAP Weapon",
  type: "command",
  color: "white",
  traits: [],
  id: "EB01-081",
  canonicalId: "EB01-081",
  externalIds: { bandai: "gundam:eb01-081" },
  slug: "map-weapon-eb01-081",
  displayName: "MAP Weapon",
  rulesText:
    "【Burst】Add this card to your hand.\n【Main】/【Action】Choose 1 to 2 enemy Units with 2 or less HP. Return them to their owners' hands.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-081",
  printings: [
    {
      id: "EB01-081",
      artId: "EB01-081",
      setCode: "EB01",
      collectorNumber: "EB01-081",
      cardNumber: "EB01-081",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-081.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-081",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-081.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 2,
  effect:
    "【Burst】Add this card to your hand.\n【Main】/【Action】Choose 1 to 2 enemy Units with 2 or less HP. Return them to their owners' hands.",
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
              count: { min: 1, max: 2 },
              attributeFilters: [{ attribute: "hp", comparison: "lte", value: 2 }],
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 to 2 enemy Units with 2 or less HP. Return them to their owners' hands.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
