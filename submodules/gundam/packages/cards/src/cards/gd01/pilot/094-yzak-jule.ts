import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd01YzakJule094: PilotCard = {
  cardNumber: "GD01-094",
  name: "Yzak Jule",
  type: "pilot",
  color: "red",
  traits: ["zaft", "coordinator"],
  id: "GD01-094",
  externalId: "gundam:gd01-094",
  slug: "yzak-jule-gd01-094",
  displayName: "Yzak Jule",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-094",
  printings: [
    {
      id: "GD01-094",
      collectorNumber: "GD01-094",
      cardNumber: "GD01-094",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-094.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-094.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-094",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-094.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-094.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>【Once per Turn】 When an enemy Link Unit is destroyed with damage while this Unit is attacking, draw 1.<br>",
  effects: [
    {
      type: "triggered",
      activation: { timing: ["burst"] },
      directives: [{ action: { action: "addSelfToHand" } }],
      sourceText: "【Burst】Add this card to your hand.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["onEnemyLinkUnitDestroyed"],
        restrictions: [{ type: "oncePerTurn" }],
        conditions: [{ type: "selfIsAttacking" }],
      },
      directives: [{ action: { action: "draw", count: 1 } }],
      sourceText:
        "【Once per Turn】 When an enemy Link Unit is destroyed with damage while this Unit is attacking, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
