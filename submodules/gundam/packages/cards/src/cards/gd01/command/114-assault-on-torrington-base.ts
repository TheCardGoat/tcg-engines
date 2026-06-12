import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd01AssaultOnTorringtonBase114: CommandCard = {
  cardNumber: "GD01-114",
  name: "Assault on Torrington Base",
  type: "command",
  color: "red",
  traits: ["zeon"],
  id: "GD01-114",
  externalId: "gundam:gd01-114",
  slug: "assault-on-torrington-base-gd01-114",
  displayName: "Assault on Torrington Base",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-114",
  printings: [
    {
      id: "GD01-114",
      collectorNumber: "GD01-114",
      cardNumber: "GD01-114",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-114.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-114.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-114",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-114.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-114.webp?260424",
  legality: "legal",
  level: 1,
  cost: 1,
  pilotName: "Yonem Kirks",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Action】Choose 2 friendly Units. They get AP+1 during this turn.<br>【Pilot】[Yonem Kirks]<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["action"],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 1,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 2,
            },
          },
        },
      ],
      sourceText:
        "【Action】Choose 2 friendly Units. They get AP+1 during this turn. 【Pilot】[Yonem Kirks]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
