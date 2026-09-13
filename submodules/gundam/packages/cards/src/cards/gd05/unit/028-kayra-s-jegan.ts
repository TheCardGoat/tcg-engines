import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd05KayraSJegan028: UnitCard = {
  cardNumber: "GD05-028",
  name: "Kayra's Jegan",
  type: "unit",
  color: "green",
  traits: ["earth federation", "londo bell"],
  id: "GD05-028",
  canonicalId: "GD05-028",
  externalIds: { bandai: "gundam:gd05-028" },
  slug: "kayra-s-jegan-gd05-028",
  displayName: "Kayra's Jegan",
  rulesText:
    "【Deploy】Choose 1 of your (Londo Bell) Units. During this turn, it may choose an active enemy Unit with 4 or less AP as its attack target.",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "GD05-028",
  printings: [
    {
      id: "GD05-028",
      artId: "GD05-028",
      setCode: "GD05",
      collectorNumber: "GD05-028",
      cardNumber: "GD05-028",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-028.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "GD05-028",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd05/GD05-028.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam: Char's Counterattack",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 3,
  linkCondition: "[Kayra Su]",
  battlefieldZones: ["space", "earth"],
  effect:
    "【Deploy】Choose 1 of your (Londo Bell) Units. During this turn, it may choose an active enemy Unit with 4 or less AP as its attack target.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "londo bell",
                },
              ],
              count: 1,
            },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              attributeFilters: [
                {
                  attribute: "ap",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
            duration: "thisTurn",
          },
        },
      ],
      sourceText:
        "【Deploy】Choose 1 of your (Londo Bell) Units. During this turn, it may choose an active enemy Unit with 4 or less AP as its attack target.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
