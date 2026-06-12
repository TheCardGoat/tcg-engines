import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const betaGuelJeturk097: PilotCard = {
  cardNumber: "GD01-097",
  name: "Guel Jeturk",
  type: "pilot",
  color: "white",
  traits: ["academy"],
  id: "GD01-097_p1",
  externalId: "gundam:gd01-097_p1",
  slug: "guel-jeturk-gd01-097-p1",
  displayName: "Guel Jeturk",
  set: { code: "BETA", name: "Edition Beta", packageId: "616000" },
  printNumber: "GD01-097_p1",
  printings: [
    {
      id: "GD01-097",
      collectorNumber: "GD01-097",
      cardNumber: "GD01-097",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-097.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-097.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-097_p1",
      collectorNumber: "GD01-097_p1",
      cardNumber: "GD01-097",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-097_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-097_p1.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "GD01-097_p1",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-097_p1.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-097_p1.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>【Activate･Main】【Once per Turn】If your opponent has 8 or more cards in their hand, set this Unit as active. It can't attack during this turn.<br>",
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
      type: "activated",
      activation: {
        timing: ["activate:main"],
        restrictions: [{ type: "oncePerTurn" }],
        conditions: [{ type: "handCount", owner: "opponent", comparison: "gte", count: 8 }],
      },
      directives: [
        { action: { action: "setActive", target: { owner: "self" } } },
        {
          action: {
            action: "cantAttack",
            duration: "thisTurn",
            target: { owner: "self", cardType: "unit" },
          },
        },
      ],
      sourceText:
        "【Activate·Main】【Once per Turn】If your opponent has 8 or more cards in their hand, set this Unit as active. It can't attack during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
