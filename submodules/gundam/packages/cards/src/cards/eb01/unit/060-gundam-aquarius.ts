import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01GundamAquarius060: UnitCard = {
  cardNumber: "EB01-060",
  name: "Gundam Aquarius",
  type: "unit",
  color: "white",
  traits: ["g generation"],
  id: "EB01-060",
  canonicalId: "EB01-060",
  externalIds: { bandai: "gundam:eb01-060" },
  slug: "gundam-aquarius-eb01-060",
  displayName: "Gundam Aquarius",
  rulesText:
    "【When Paired・Development 3】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect:\n\n■Choose 1 enemy Unit that is Lv.4 or lower. Return it to its owner's hand.",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-060",
  printings: [
    {
      id: "EB01-060",
      artId: "EB01-060",
      setCode: "EB01",
      collectorNumber: "EB01-060",
      cardNumber: "EB01-060",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-060.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-060",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-060.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "(Support) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "【When Paired・Development 3】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect:\n\n■Choose 1 enemy Unit that is Lv.4 or lower. Return it to its owner's hand.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
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
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 4,
                },
              ],
              count: 1,
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【When Paired·Development 3】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect: ■Choose 1 enemy Unit that is Lv.4 or lower. Return it to its owner's hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
