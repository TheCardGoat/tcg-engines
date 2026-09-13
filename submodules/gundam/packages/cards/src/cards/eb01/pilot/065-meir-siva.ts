import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const eb01MeirSiva065: PilotCard = {
  cardNumber: "EB01-065",
  name: "Meir Siva",
  type: "pilot",
  color: "green",
  traits: ["g generation", "attack"],
  id: "EB01-065",
  canonicalId: "EB01-065",
  externalIds: { bandai: "gundam:eb01-065" },
  slug: "meir-siva-eb01-065",
  displayName: "Meir Siva",
  rulesText:
    "【Burst】Add this card to your hand.\n【When Linked】Choose 1 friendly (G Generation) Unit. It gains <Breach 1> during this turn.\n\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
  set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
  printNumber: "EB01-065",
  printings: [
    {
      id: "EB01-065",
      artId: "EB01-065",
      setCode: "EB01",
      collectorNumber: "EB01-065",
      cardNumber: "EB01-065",
      set: { code: "EB01", name: "Eternal Nexus [EB01]", packageId: "616201" },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-065.webp",
      productName: "Eternal Nexus [EB01]",
    },
  ],
  selectedPrintingId: "EB01-065",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/eb01/EB01-065.webp",
  legality: "legal",
  sourceTitle: "SD Gundam G Generation ETERNAL",
  level: 4,
  cost: 1,
  apBonus: 1,
  hpBonus: 2,
  effect:
    "【Burst】Add this card to your hand.\n【When Linked】Choose 1 friendly (G Generation) Unit. It gains <Breach 1> during this turn.\n\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
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
        timing: ["whenLinked"],
      },
      directives: [
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
        },
      ],
      sourceText:
        "【When Linked】Choose 1 friendly (G Generation) Unit. It gains <Breach 1> during this turn. (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
