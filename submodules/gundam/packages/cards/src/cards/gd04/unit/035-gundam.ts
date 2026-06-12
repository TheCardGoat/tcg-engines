import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04Gundam035: UnitCard = {
  cardNumber: "GD04-035",
  name: "Ξ Gundam",
  type: "unit",
  color: "red",
  traits: ["mafty"],
  id: "GD04-035",
  externalId: "gundam:gd04-035",
  slug: "gundam-gd04-035",
  displayName: "Ξ Gundam",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-035",
  printings: [
    {
      id: "GD04-035",
      collectorNumber: "GD04-035",
      cardNumber: "GD04-035",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-035.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-035.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-035",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-035.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-035.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "[Hathaway Noa]",
  effect:
    "【Deploy】Choose 1 of your (Mafty) Units. When it destroys an enemy Unit with battle damage during this turn, if you have 3 or less cards in your hand, draw 1.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "createDelayedTrigger",
            duration: "thisTurn",
            eventType: "attackerDestroyedDefender",
            eventSourceFilter: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "mafty" }],
            },
            eventCardFilter: {
              owner: "friendly",
              cardType: "unit",
            },
            effect: {
              type: "triggered",
              activation: {
                timing: ["onDestroyByBattle"],
                conditions: [{ type: "handCount", owner: "friendly", comparison: "lte", count: 3 }],
              },
              directives: [{ action: { action: "draw", count: 1 } }],
              sourceText:
                "When it destroys an enemy Unit with battle damage during this turn, if you have 3 or less cards in your hand, draw 1.",
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Choose 1 of your (Mafty) Units. When it destroys an enemy Unit with battle damage during this turn, if you have 3 or less cards in your hand, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
