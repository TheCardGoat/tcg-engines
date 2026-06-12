import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04VictoryGundam011: UnitCard = {
  cardNumber: "GD04-011",
  name: "Victory Gundam",
  type: "unit",
  color: "blue",
  traits: ["league militaire", "victory type"],
  id: "GD04-011",
  externalId: "gundam:gd04-011",
  slug: "victory-gundam-gd04-011",
  displayName: "Victory Gundam",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-011",
  printings: [
    {
      id: "GD04-011",
      collectorNumber: "GD04-011",
      cardNumber: "GD04-011",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-011.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-011.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-011",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-011.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-011.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 2,
  effect:
    "【Destroyed】If another friendly (League Militaire) Unit is in play, deploy 1 [Parts]((League Militaire)･AP1･HP1･This Unit can't choose the enemy player as its attack target) Unit token.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: "league militaire",
            excludeSelf: true,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "deployToken",
            token: {
              name: "Parts",
              traits: ["league militaire"],
              ap: 1,
              hp: 1,
              cantTargetPlayer: true,
              deployState: "active",
            },
          },
        },
      ],
      sourceText:
        "【Destroyed】If another friendly (League Militaire) Unit is in play, deploy 1 [Parts]((League Militaire)·AP1·HP1·This Unit can't choose the enemy player as its attack target) Unit token.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
