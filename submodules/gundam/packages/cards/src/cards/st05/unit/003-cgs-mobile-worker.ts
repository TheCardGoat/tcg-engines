import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const st05CgsMobileWorker003: UnitCard = {
  cardNumber: "ST05-003",
  name: "CGS Mobile Worker",
  type: "unit",
  color: "purple",
  traits: ["tekkadan"],
  id: "ST05-003",
  externalId: "gundam:st05-003",
  slug: "cgs-mobile-worker-st05-003",
  displayName: "CGS Mobile Worker",
  set: { code: "ST05", name: "Iron Bloom [ST05]", packageId: "616005" },
  printNumber: "ST05-003",
  printings: [
    {
      id: "ST05-003",
      collectorNumber: "ST05-003",
      cardNumber: "ST05-003",
      set: {
        code: "ST05",
        name: "Iron Bloom [ST05]",
        packageId: "616005",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-003.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-003.webp?260424",
      productName: "Iron Bloom [ST05]",
    },
    {
      id: "ST05-003_p1",
      collectorNumber: "ST05-003_p1",
      cardNumber: "ST05-003",
      set: {
        code: "ST05",
        name: "Iron Bloom [ST05] Bonus Pack",
        packageId: "616005",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-003_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-003_p1.webp?260424",
      productName: "Iron Bloom [ST05] Bonus Pack",
    },
  ],
  selectedPrintingId: "ST05-003",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/st05/ST05-003.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-003.webp?260424",
  legality: "legal",
  level: 1,
  cost: 1,
  ap: 0,
  hp: 2,
  effect:
    "【Activate･Main】Rest this Unit：Choose 1 of your Units. Deal 1 damage to it. It gets AP+1 during this turn.<br>",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:main"],
      },
      cost: {
        restSelf: true,
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
            },
          },
        },
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Activate·Main】Rest this Unit：Choose 1 of your Units. Deal 1 damage to it. It gets AP+1 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
