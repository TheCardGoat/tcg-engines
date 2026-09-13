import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01Tallgeese027: UnitCard = {
  cardNumber: "EB01-027",
  name: "Tallgeese",
  type: "unit",
  color: "green",
  traits: ["g generation"],
  id: "EB01-027",
  canonicalId: "EB01-027",
  externalIds: { bandai: "gundam:eb01-027" },
  slug: "tallgeese-eb01-027",
  displayName: "Tallgeese",
  rulesText:
    "【Deploy・Development 2】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect:\n\n■Choose 1 friendly (G Generation) Unit. It gains <Breach 1> during this turn.\n\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-027",
  printings: [
    {
      id: "EB01-027",
      artId: "EB01-027",
      setCode: "EB01",
      collectorNumber: "EB01-027",
      cardNumber: "EB01-027",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-027.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-027",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-027.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 3,
  linkCondition: "(G Generation) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Deploy・Development 2】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect:\n\n■Choose 1 friendly (G Generation) Unit. It gains <Breach 1> during this turn.\n\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
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
              count: 2,
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
            action: "grantKeyword",
            keyword: "Breach",
            keywordValue: 1,
            duration: "thisTurn",
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
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Deploy·Development 2】You may exile the specified number of (G Generation) cards in your trash from the game. If you do, activate the following effect: ■Choose 1 friendly (G Generation) Unit. It gains <Breach 1> during this turn. (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
