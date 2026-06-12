import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04RozenZulu039: UnitCard = {
  cardNumber: "GD04-039",
  name: "Rozen Zulu",
  type: "unit",
  color: "red",
  traits: ["neo zeon"],
  id: "GD04-039",
  externalId: "gundam:gd04-039",
  slug: "rozen-zulu-gd04-039",
  displayName: "Rozen Zulu",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-039",
  printings: [
    {
      id: "GD04-039",
      collectorNumber: "GD04-039",
      cardNumber: "GD04-039",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-039.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-039.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-039",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-039.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-039.webp?260424",
  legality: "legal",
  level: 4,
  cost: 6,
  ap: 4,
  hp: 4,
  linkCondition: "[Angelo Sauper]",
  effect:
    "If there are 8 or more (Neo Zeon) cards in your trash, this card in your hand gets cost -4.\n【Deploy】Choose 1 enemy Unit. Deal 1 damage to it. If it has <Repair>, deal 3 damage instead.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 8,
            hasTrait: "neo zeon",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "costReduction",
            amount: 4,
            target: {
              owner: "self",
            },
          },
        },
      ],
      sourceText:
        "If there are 8 or more (Neo Zeon) cards in your trash, this card in your hand gets cost -4.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
        {
          optional: true,
          action: {
            action: "dealDamage",
            amount: 2,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              hasKeyword: "Repair",
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Choose 1 enemy Unit. Deal 1 damage to it. If it has <Repair>, deal 3 damage instead.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
