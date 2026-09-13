import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const eb01WarshipCruise082: CommandCard = {
  cardNumber: "EB01-082",
  name: "Warship Cruise",
  type: "command",
  color: "white",
  traits: [],
  id: "EB01-082",
  canonicalId: "EB01-082",
  externalIds: { bandai: "gundam:eb01-082" },
  slug: "warship-cruise-eb01-082",
  displayName: "Warship Cruise",
  rulesText:
    "【Burst】Activate this card's 【Action】.\n【Action】Choose 1 Unit that is Lv.3 or lower belonging to each enemy player. Return them to their owners' hands.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-082",
  printings: [
    {
      id: "EB01-082",
      artId: "EB01-082",
      setCode: "EB01",
      collectorNumber: "EB01-082",
      cardNumber: "EB01-082",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-082.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-082",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-082.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 3,
  cost: 1,
  effect:
    "【Burst】Activate this card's 【Action】.\n【Action】Choose 1 Unit that is Lv.3 or lower belonging to each enemy player. Return them to their owners' hands.",
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
            timing: "action",
          },
        },
      ],
      sourceText: "【Burst】Activate this card's 【Action】.",
    },
    {
      type: "command",
      activation: {
        timing: ["action"],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 3 }],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Action】Choose 1 Unit that is Lv.3 or lower belonging to each enemy player. Return them to their owners' hands.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
