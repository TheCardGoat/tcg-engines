import type { BaseCard, CardEffect } from "@tcg/gundam-types";

export const gd0113thTacticalTestingSector130: BaseCard = {
  cardNumber: "GD01-130",
  name: "13th Tactical Testing Sector",
  type: "base",
  traits: ["academy", "stronghold"],
  id: "GD01-130",
  externalId: "gundam:gd01-130",
  slug: "13th-tactical-testing-sector-gd01-130",
  displayName: "13th Tactical Testing Sector",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-130",
  printings: [
    {
      id: "GD01-130",
      collectorNumber: "GD01-130",
      cardNumber: "GD01-130",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-130.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-130.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-130",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-130.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-130.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand.<br>\n【Activate･Main】Rest this Base：If a friendly (Academy) Unit is in play, choose 1 enemy Unit. It gets AP-1 during this turn.<br>",
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
      activation: {
        timing: ["activate:main"],
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: "academy",
          },
        ],
      },
      cost: { restSelf: true },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -1,
            duration: "thisTurn",
            target: { owner: "opponent", cardType: "unit", count: 1 },
          },
        },
      ],
      sourceText:
        "【Activate･Main】Rest this Base：If a friendly (Academy) Unit is in play, choose 1 enemy Unit. It gets AP-1 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
