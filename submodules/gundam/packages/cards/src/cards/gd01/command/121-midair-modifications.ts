import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd01MidairModifications121: CommandCard = {
  cardNumber: "GD01-121",
  name: "Midair Modifications",
  type: "command",
  color: "white",
  traits: ["-"],
  id: "GD01-121",
  externalId: "gundam:gd01-121",
  slug: "midair-modifications-gd01-121",
  displayName: "Midair Modifications",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-121",
  printings: [
    {
      id: "GD01-121",
      collectorNumber: "GD01-121",
      cardNumber: "GD01-121",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-121.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-121.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-121",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-121.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-121.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  effect:
    "【Burst】Activate this card's 【Main】.<br>【Main】Choose 1 rested Unit with &lt;Blocker&gt;. Set it as active. It can't attack during this turn.<br>",
  effects: [
    {
      type: "triggered",
      activation: { timing: ["burst"] },
      directives: [{ action: { action: "activateTiming", timing: "main" } }],
      sourceText: "【Burst】Activate this card's 【Main】.",
    },
    {
      type: "command",
      activation: { timing: ["main"] },
      directives: [
        {
          action: {
            action: "setActive",
            target: {
              owner: "any",
              cardType: "unit",
              count: 1,
              state: "rested",
              hasKeyword: "Blocker",
            },
          },
        },
        {
          action: {
            action: "cantAttack",
            duration: "thisTurn",
            target: {
              owner: "any",
              cardType: "unit",
              count: 1,
              hasKeyword: "Blocker",
            },
          },
        },
      ],
      sourceText:
        "【Main】Choose 1 rested Unit with <Blocker>. Set it as active. It can't attack during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
