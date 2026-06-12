import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd03JamilNeate096: PilotCard = {
  cardNumber: "GD03-096",
  name: "Jamil Neate",
  type: "pilot",
  color: "purple",
  traits: ["vulture", "newtype"],
  id: "GD03-096",
  externalId: "gundam:gd03-096",
  slug: "jamil-neate-gd03-096",
  displayName: "Jamil Neate",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-096",
  printings: [
    {
      id: "GD03-096",
      collectorNumber: "GD03-096",
      cardNumber: "GD03-096",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-096.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-096.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-096",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-096.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-096.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.\n【During Link】【Attack】You may discard 1. If you do, draw 1.",
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
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [{ type: "duringLink" }],
      },
      directives: [
        {
          action: {
            action: "discard",
            count: 1,
          },
          optional: true,
        },
        {
          action: {
            action: "draw",
            count: 1,
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText: "【During Link】【Attack】You may discard 1. If you do, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
