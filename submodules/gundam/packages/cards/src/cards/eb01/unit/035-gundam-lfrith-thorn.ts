import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01GundamLfrithThorn035: UnitCard = {
  cardNumber: "EB01-035",
  name: "Gundam Lfrith Thorn",
  type: "unit",
  color: "green",
  traits: ["g generation"],
  id: "EB01-035",
  canonicalId: "EB01-035",
  externalIds: { bandai: "gundam:eb01-035" },
  slug: "gundam-lfrith-thorn-eb01-035",
  displayName: "Gundam Lfrith Thorn",
  rulesText:
    "When another friendly (G Generation) Unit that is Lv.3 is deployed, this Unit gains <Breach 1> during this turn.\n\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-035",
  printings: [
    {
      id: "EB01-035",
      artId: "EB01-035",
      setCode: "EB01",
      collectorNumber: "EB01-035",
      cardNumber: "EB01-035",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-035.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-035",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-035.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 3,
  linkCondition: "(Support) Trait",
  battlefieldZones: ["space", "earth"],
  effect:
    "When another friendly (G Generation) Unit that is Lv.3 is deployed, this Unit gains <Breach 1> during this turn.\n\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
        conditions: [
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              excludeSource: true,
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "g generation" },
                { attribute: "level", comparison: "eq", value: 3 },
              ],
            },
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Breach",
            keywordValue: 1,
            duration: "thisTurn",
            target: { owner: "self", cardType: "unit" },
          },
        },
      ],
      sourceText:
        "When another friendly (G Generation) Unit that is Lv.3 is deployed, this Unit gains <Breach 1> during this turn. (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
