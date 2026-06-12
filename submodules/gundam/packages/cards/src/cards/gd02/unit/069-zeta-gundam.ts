import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02ZetaGundam069: UnitCard = {
  cardNumber: "GD02-069",
  name: "Zeta Gundam",
  type: "unit",
  color: "white",
  traits: ["aeug"],
  id: "GD02-069",
  externalId: "gundam:gd02-069",
  slug: "zeta-gundam-gd02-069",
  displayName: "Zeta Gundam",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-069",
  printings: [
    {
      id: "GD02-069",
      collectorNumber: "GD02-069",
      cardNumber: "GD02-069",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-069.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-069.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-069_p1",
      collectorNumber: "GD02-069_p1",
      cardNumber: "GD02-069",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-069_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-069_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-069_p2",
      collectorNumber: "GD02-069_p2",
      cardNumber: "GD02-069",
      set: {
        code: "GD02",
        name: "Newtype Challenge 2025 Mission 2",
        packageId: "616901",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-069_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-069_p2.webp?260424",
      productName: "Newtype Challenge 2025 Mission 2",
    },
  ],
  selectedPrintingId: "GD02-069",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-069.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-069.webp?260424",
  legality: "legal",
  level: 6,
  cost: 5,
  ap: 5,
  hp: 4,
  linkCondition: "[Kamille Bidan]",
  effect:
    "【During Link】【Activate･Main】【Once per Turn】Choose 1 active friendly Base. Rest it. If you do, set this Unit as active. It can't choose the enemy player as its attack target during this turn.",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:main"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
        conditions: [{ type: "duringLink" }],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "friendly",
              cardType: "base",
              state: "active",
              count: 1,
            },
          },
        },
        {
          action: {
            action: "setActive",
            target: {
              owner: "self",
              cardType: "unit",
              state: "rested",
            },
          },
          dependsOnPrevious: true,
        },
        {
          action: {
            action: "cantTargetPlayer",
            whose: "opponent",
          },
        },
      ],
      sourceText:
        "【During Link】【Activate·Main】【Once per Turn】Choose 1 active friendly Base. Rest it. If you do, set this Unit as active. It can't choose the enemy player as its attack target during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
