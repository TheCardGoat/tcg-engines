import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01GundamBarbatos6thForm010: UnitCard = {
  cardNumber: "EB01-010",
  name: "Gundam Barbatos 6th Form",
  type: "unit",
  color: "blue",
  traits: ["g generation"],
  id: "EB01-010",
  canonicalId: "EB01-010",
  externalIds: { bandai: "gundam:eb01-010" },
  slug: "gundam-barbatos-6th-form-eb01-010",
  displayName: "Gundam Barbatos 6th Form",
  rulesText:
    "【Deploy・Development 3】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect:\n\n■Choose 1 rested enemy Unit. Deal 2 damage to it.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-010",
  printings: [
    {
      id: "EB01-010",
      artId: "EB01-010",
      setCode: "EB01",
      collectorNumber: "EB01-010",
      cardNumber: "EB01-010",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-010.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-010",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-010.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 5,
  cost: 4,
  ap: 5,
  hp: 2,
  battlefieldZones: ["space", "earth"],
  effect:
    "【Deploy・Development 3】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect:\n\n■Choose 1 rested enemy Unit. Deal 2 damage to it.",
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
              count: 3,
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
            action: "dealDamage",
            amount: 2,
            target: {
              owner: "opponent",
              cardType: "unit",
              state: "rested",
              count: 1,
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Deploy·Development 3】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect: ■Choose 1 rested enemy Unit. Deal 2 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
