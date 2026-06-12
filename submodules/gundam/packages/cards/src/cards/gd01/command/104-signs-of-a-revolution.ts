import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd01SignsOfARevolution104: CommandCard = {
  cardNumber: "GD01-104",
  name: "Signs of a Revolution",
  type: "command",
  color: "blue",
  traits: ["-"],
  id: "GD01-104",
  externalId: "gundam:gd01-104",
  slug: "signs-of-a-revolution-gd01-104",
  displayName: "Signs of a Revolution",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-104",
  printings: [
    {
      id: "GD01-104",
      collectorNumber: "GD01-104",
      cardNumber: "GD01-104",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-104.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-104.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-104",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-104.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-104.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  effect: "【Burst】Draw 1.<br>【Main】Choose 1 rested enemy Unit. Deal 2 damage to it.<br>",
  effects: [
    {
      type: "triggered",
      activation: { timing: ["burst"] },
      directives: [{ action: { action: "draw", count: 1 } }],
      sourceText: "【Burst】Draw 1.",
    },
    {
      type: "command",
      activation: { timing: ["main"] },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 2,
            target: { owner: "opponent", cardType: "unit", count: 1, state: "rested" },
          },
        },
      ],
      sourceText: "【Main】Choose 1 rested enemy Unit. Deal 2 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
