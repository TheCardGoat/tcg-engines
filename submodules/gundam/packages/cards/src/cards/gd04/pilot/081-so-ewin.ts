import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd04SoEwin081: PilotCard = {
  cardNumber: "GD04-081",
  name: "Üso Ewin",
  type: "pilot",
  color: "blue",
  traits: ["league militaire", "newtype"],
  id: "GD04-081",
  externalId: "gundam:gd04-081",
  slug: "so-ewin-gd04-081",
  displayName: "Üso Ewin",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-081",
  printings: [
    {
      id: "GD04-081",
      collectorNumber: "GD04-081",
      cardNumber: "GD04-081",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-081.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-081.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-081_p1",
      collectorNumber: "GD04-081_p1",
      cardNumber: "GD04-081",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-081_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-081_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-081",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-081.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-081.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【When Paired】If this is a (League Militaire) Unit, deploy 1 [Parts]((League Militaire)･AP1･HP1･This Unit can't choose the enemy player as its attack target) Unit token.",
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
        timing: ["whenPaired"],
        conditions: [{ type: "linkedUnitHasTrait", trait: "league militaire" }],
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
        "【When Paired】If this is a (League Militaire) Unit, deploy 1 [Parts]((League Militaire)·AP1·HP1·This Unit can't choose the enemy player as its attack target) Unit token.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
