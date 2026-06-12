import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd04DamageControl113: CommandCard = {
  cardNumber: "GD04-113",
  name: "Damage Control",
  type: "command",
  color: "purple",
  traits: [],
  id: "GD04-113",
  externalId: "gundam:gd04-113",
  slug: "damage-control-gd04-113",
  displayName: "Damage Control",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-113",
  printings: [
    {
      id: "GD04-113",
      collectorNumber: "GD04-113",
      cardNumber: "GD04-113",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-113.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-113.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-113",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-113.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-113.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  effect:
    "【Burst】Choose 1 enemy Unit. It gets AP-2 during this turn.\n【Action】Choose 1 of your Units. During this battle, reduce battle damage it receives by 3.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -2,
            duration: "thisTurn",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【Burst】Choose 1 enemy Unit. It gets AP-2 during this turn.",
    },
    {
      type: "command",
      activation: {
        timing: ["action"],
      },
      directives: [
        {
          action: {
            action: "reduceNextDamage",
            amount: 3,
            damageType: "battle",
            duration: "thisBattle",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Action】Choose 1 of your Units. During this battle, reduce battle damage it receives by 3.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
