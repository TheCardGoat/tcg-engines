import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04VictoryGundamHexa007: UnitCard = {
  cardNumber: "GD04-007",
  name: "Victory Gundam Hexa",
  type: "unit",
  color: "blue",
  traits: ["league militaire", "victory type"],
  id: "GD04-007",
  externalId: "gundam:gd04-007",
  slug: "victory-gundam-hexa-gd04-007",
  displayName: "Victory Gundam Hexa",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-007",
  printings: [
    {
      id: "GD04-007",
      collectorNumber: "GD04-007",
      cardNumber: "GD04-007",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-007.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-007.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-007",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-007.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-007.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "(League Militaire) Trait",
  effect:
    "【During Pair】【Attack】Deploy 1 [Parts]((League Militaire)･AP1･HP1･This Unit can't choose the enemy player as its attack target) Unit token.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [{ type: "duringPair" }],
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
        "【During Pair】【Attack】Deploy 1 [Parts]((League Militaire)·AP1·HP1·This Unit can't choose the enemy player as its attack target) Unit token.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
