import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GrahamSUnionFlagCustomGnFlag071: UnitCard = {
  cardNumber: "GD04-071",
  name: "Graham's Union Flag Custom Ⅱ (GN Flag)",
  type: "unit",
  color: "white",
  traits: ["un"],
  id: "GD04-071",
  externalId: "gundam:gd04-071",
  slug: "graham-s-union-flag-custom-gn-flag-gd04-071",
  displayName: "Graham's Union Flag Custom Ⅱ (GN Flag)",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-071",
  printings: [
    {
      id: "GD04-071",
      collectorNumber: "GD04-071",
      cardNumber: "GD04-071",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-071.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-071.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-071_p1",
      collectorNumber: "GD04-071_p1",
      cardNumber: "GD04-071",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-071_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-071_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-071",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-071.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-071.webp?260424",
  legality: "legal",
  level: 5,
  cost: 3,
  ap: 4,
  hp: 3,
  linkCondition: "[Graham Aker]",
  effect:
    "【Burst】If an enemy (CB) Unit is in play, add this card to your hand.\n【Activate･Main】Choose 1 (Superpower Bloc) card and 1 (UN) card from your trash. Exile them from the game. If you do, set this Unit as active. It can't attack during this turn.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
        conditions: [
          {
            type: "cardInZone",
            owner: "opponent",
            zone: "battleArea",
            cardType: "unit",
            comparison: "gte",
            count: 1,
            hasTrait: "cb",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "addSelfToHand",
          },
        },
      ],
      sourceText: "【Burst】If an enemy (CB) Unit is in play, add this card to your hand.",
    },
    {
      type: "activated",
      activation: {
        timing: ["activate:main"],
      },
      directives: [
        {
          action: {
            action: "exile",
            target: {
              owner: "friendly",
              zone: "trash",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "superpower bloc",
                },
              ],
              count: 1,
            },
          },
        },
        {
          action: {
            action: "exile",
            target: {
              owner: "friendly",
              zone: "trash",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "un",
                },
              ],
              count: 1,
            },
          },
          dependsOnPrevious: true,
        },
        {
          action: {
            action: "setActive",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
          dependsOnPrevious: true,
        },
        {
          action: {
            action: "cantAttack",
            duration: "thisTurn",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Activate·Main】Choose 1 (Superpower Bloc) card and 1 (UN) card from your trash. Exile them from the game. If you do, set this Unit as active. It can't attack during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
