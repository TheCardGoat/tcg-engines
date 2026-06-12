import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd01DearkaElthman095: PilotCard = {
  cardNumber: "GD01-095",
  name: "Dearka Elthman",
  type: "pilot",
  color: "red",
  traits: ["zaft", "coordinator"],
  id: "GD01-095",
  externalId: "gundam:gd01-095",
  slug: "dearka-elthman-gd01-095",
  displayName: "Dearka Elthman",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-095",
  printings: [
    {
      id: "GD01-095",
      collectorNumber: "GD01-095",
      cardNumber: "GD01-095",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-095.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-095.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-095",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-095.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-095.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>【When Linked】Discard 1. If you do, draw 1.<br>",
  effects: [
    {
      type: "triggered",
      activation: { timing: ["burst"] },
      directives: [{ action: { action: "addSelfToHand" } }],
      sourceText: "【Burst】Add this card to your hand.",
    },
    {
      type: "triggered",
      activation: { timing: ["whenLinked"] },
      directives: [
        { action: { action: "discard", count: 1 } },
        // "If you do, ..." — draw only if the preceding discard
        // actually resolved (hand had a card to discard).
        { action: { action: "draw", count: 1 }, dependsOnPrevious: true },
      ],
      sourceText: "【When Linked】Discard 1. If you do, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
