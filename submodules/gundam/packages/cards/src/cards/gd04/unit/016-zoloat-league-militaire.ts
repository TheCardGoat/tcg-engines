import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04ZoloatLeagueMilitaire016: UnitCard = {
  cardNumber: "GD04-016",
  name: "Zoloat (League Militaire)",
  type: "unit",
  color: "blue",
  traits: ["league militaire"],
  id: "GD04-016",
  externalId: "gundam:gd04-016",
  slug: "zoloat-league-militaire-gd04-016",
  displayName: "Zoloat (League Militaire)",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-016",
  printings: [
    {
      id: "GD04-016",
      collectorNumber: "GD04-016",
      cardNumber: "GD04-016",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-016.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-016.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-016",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-016.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-016.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 3,
  hp: 2,
  effect:
    "<Blocker> (Rest this Unit to change the attack target to it.)\nThis Unit can't choose the enemy player as its attack target.",
  effects: [
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "cantTargetPlayer",
            whose: "opponent",
          },
        },
      ],
      sourceText: "This Unit can't choose the enemy player as its attack target.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Blocker" }],
  rarity: "common",
};
