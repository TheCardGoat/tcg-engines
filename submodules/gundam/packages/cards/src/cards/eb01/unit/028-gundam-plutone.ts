import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const eb01GundamPlutone028: UnitCard = {
  cardNumber: "EB01-028",
  name: "Gundam Plutone",
  type: "unit",
  color: "green",
  traits: ["g generation"],
  id: "EB01-028",
  canonicalId: "EB01-028",
  externalIds: { bandai: "gundam:eb01-028" },
  slug: "gundam-plutone-eb01-028",
  displayName: "Gundam Plutone",
  rulesText:
    "【Once per Turn】When another Unit attacks an enemy Unit, if this Unit is rested, the attacking Unit gains <Breach 2> during this battle.\n\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-028",
  printings: [
    {
      id: "EB01-028",
      artId: "EB01-028",
      setCode: "EB01",
      collectorNumber: "EB01-028",
      cardNumber: "EB01-028",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-028.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-028",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-028.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 3,
  linkCondition: "[Chall Acustica]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Once per Turn】When another Unit attacks an enemy Unit, if this Unit is rested, the attacking Unit gains <Breach 2> during this battle.\n\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          {
            type: "eventSourceMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              excludeSource: true,
            },
          },
          {
            type: "eventAttackTargetsUnit",
          },
          {
            type: "selfIsRested",
          },
        ],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeywordEventSource",
            keyword: "Breach",
            keywordValue: 2,
            duration: "thisBattle",
            sourceFilter: {
              owner: "friendly",
              cardType: "unit",
              excludeSource: true,
            },
          },
        },
      ],
      sourceText:
        "【Once per Turn】When another Unit attacks an enemy Unit, if this Unit is rested, the attacking Unit gains <Breach 2> during this battle. (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
