import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd01MiningAsteroidPalau128: BaseCard = {
  cardNumber: "GD01-128",
  name: "Mining Asteroid Palau",
  type: "base",
  traits: ["neo zeon", "stronghold"],
  id: "GD01-128",
  externalId: "gundam:gd01-128",
  slug: "mining-asteroid-palau-gd01-128",
  displayName: "Mining Asteroid Palau",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-128",
  printings: [
    {
      id: "GD01-128",
      collectorNumber: "GD01-128",
      cardNumber: "GD01-128",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-128.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-128.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-128",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-128.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-128.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  hp: 6,
  effect: "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "deploySelf",
          },
        },
      ],
      sourceText: "【Burst】Deploy this card.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "addShieldToHand",
            count: 1,
          },
        },
      ],
      sourceText: "【Deploy】Add 1 of your Shields to your hand.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
