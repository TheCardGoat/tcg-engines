import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GundamAirmasterBurst051: UnitCard = {
  cardNumber: "GD04-051",
  name: "Gundam Airmaster Burst",
  type: "unit",
  color: "purple",
  traits: ["vulture"],
  id: "GD04-051",
  externalId: "gundam:gd04-051",
  slug: "gundam-airmaster-burst-gd04-051",
  displayName: "Gundam Airmaster Burst",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-051",
  printings: [
    {
      id: "GD04-051",
      collectorNumber: "GD04-051",
      cardNumber: "GD04-051",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-051.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-051.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-051",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-051.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-051.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 5,
  hp: 3,
  linkCondition: "[Witz Sou]",
  effect:
    "【During Pair･(Vulture) Pilot】If there are 7 or more cards in your trash, this Unit may choose an active enemy Unit with a keyword effect as its attack target.",
  effects: [
    {
      type: "constant",
      activation: {
        qualification: {
          attribute: "trait",
          comparison: "includes",
          value: "vulture",
        },
        conditions: [
          { type: "duringPair" },
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 7,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: {
              owner: "self",
              cardType: "unit",
              count: 1,
            },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              hasAnyKeyword: true,
            },
          },
        },
      ],
      sourceText:
        "【During Pair·(Vulture) Pilot】If there are 7 or more cards in your trash, this Unit may choose an active enemy Unit with a keyword effect as its attack target.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
