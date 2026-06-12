import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04PenelopeFlightForm002: UnitCard = {
  cardNumber: "GD04-002",
  name: "Penelope (Flight Form)",
  type: "unit",
  color: "blue",
  traits: ["earth federation"],
  id: "GD04-002",
  externalId: "gundam:gd04-002",
  slug: "penelope-flight-form-gd04-002",
  displayName: "Penelope (Flight Form)",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-002",
  printings: [
    {
      id: "GD04-002",
      collectorNumber: "GD04-002",
      cardNumber: "GD04-002",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-002.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-002.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-002_p1",
      collectorNumber: "GD04-002_p1",
      cardNumber: "GD04-002",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-002_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-002_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-002",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-002.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-002.webp?260424",
  legality: "legal",
  level: 6,
  cost: 5,
  ap: 3,
  hp: 5,
  linkCondition: "[Lane Aim]",
  effect:
    "During your turn, all your (Earth Federation) Units get AP+1.\n【Deploy】During this turn, when one of your (Earth Federation) Units destroys an enemy Unit with battle damage, choose 1 enemy Unit with 5 or less HP. Rest it.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "isTurn",
            whose: "friendly",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "permanent",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: "all",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "earth federation",
                },
              ],
            },
          },
        },
      ],
      sourceText: "During your turn, all your (Earth Federation) Units get AP+1.",
    },
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
            eventCardFilter: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: "earth federation" },
              ],
            },
            effect: {
              type: "triggered",
              activation: { timing: ["onDestroyByBattle"] },
              directives: [
                {
                  action: {
                    action: "rest",
                    target: {
                      owner: "opponent",
                      cardType: "unit",
                      state: "active",
                      count: 1,
                      attributeFilters: [{ attribute: "hp", comparison: "lte", value: 5 }],
                    },
                  },
                },
              ],
              sourceText:
                "During this turn, when one of your (Earth Federation) Units destroys an enemy Unit with battle damage, choose 1 enemy Unit with 5 or less HP. Rest it.",
            },
          },
        },
      ],
      sourceText:
        "【Deploy】During this turn, when one of your (Earth Federation) Units destroys an enemy Unit with battle damage, choose 1 enemy Unit with 5 or less HP. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
