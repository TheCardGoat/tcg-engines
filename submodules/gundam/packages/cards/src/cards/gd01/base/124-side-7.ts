import type { BaseCard, CardEffect } from "@tcg/gundam-types";

export const gd01Side7124: BaseCard = {
  cardNumber: "GD01-124",
  name: "Side 7",
  type: "base",
  traits: ["earth federation", "stronghold"],
  id: "GD01-124",
  externalId: "gundam:gd01-124",
  slug: "side-7-gd01-124",
  displayName: "Side 7",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-124",
  printings: [
    {
      id: "GD01-124",
      collectorNumber: "GD01-124",
      cardNumber: "GD01-124",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-124.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-124.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-124_p1",
      collectorNumber: "GD01-124_p1",
      cardNumber: "GD01-124",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-124_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-124_p1.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "GD01-124",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-124.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-124.webp?260424",
  legality: "legal",
  level: 1,
  cost: 1,
  hp: 4,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand.<br>\n【Activate･Main】Rest this Base：Choose 1 friendly Unit. It recovers 1 HP.<br>",
  effects: [
    {
      type: "triggered",
      activation: { timing: ["burst"] },
      directives: [{ action: { action: "deploySelf" } }],
      sourceText: "【Burst】Deploy this card.",
    },
    {
      type: "triggered",
      activation: { timing: ["deploy"] },
      directives: [{ action: { action: "addShieldToHand", count: 1 } }],
      sourceText: "【Deploy】Add 1 of your Shields to your hand.",
    },
    {
      type: "activated",
      activation: { timing: ["activate:main"] },
      cost: { restSelf: true },
      directives: [
        {
          action: {
            action: "recoverHP",
            amount: 1,
            target: { owner: "friendly", cardType: "unit", count: 1 },
          },
        },
      ],
      sourceText: "【Activate･Main】Rest this Base：Choose 1 friendly Unit. It recovers 1 HP.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
