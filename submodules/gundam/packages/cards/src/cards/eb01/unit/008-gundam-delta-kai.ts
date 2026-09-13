import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01GundamDeltaKai008: UnitCard = {
  cardNumber: "EB01-008",
  name: "Gundam Delta Kai",
  type: "unit",
  color: "blue",
  traits: ["g generation"],
  id: "EB01-008",
  canonicalId: "EB01-008",
  externalIds: { bandai: "gundam:eb01-008" },
  slug: "gundam-delta-kai-eb01-008",
  displayName: "Gundam Delta Kai",
  rulesText:
    "【Deploy・Development 1】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect:\n\n■Choose 1 friendly Unit. It recovers 2 HP.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-008",
  printings: [
    {
      id: "EB01-008",
      artId: "EB01-008",
      setCode: "EB01",
      collectorNumber: "EB01-008",
      cardNumber: "EB01-008",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-008.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-008",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-008.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "(G Generation) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Deploy・Development 1】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect:\n\n■Choose 1 friendly Unit. It recovers 2 HP.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "exile",
            target: {
              owner: "friendly",
              zone: "trash",
              count: 1,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "g generation",
                },
              ],
            },
          },
          optional: true,
        },
        {
          action: {
            action: "recoverHP",
            amount: 2,
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Deploy·Development 1】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect: ■Choose 1 friendly Unit. It recovers 2 HP.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
