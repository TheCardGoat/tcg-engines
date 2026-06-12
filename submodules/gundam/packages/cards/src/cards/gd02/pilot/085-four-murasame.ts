import type { CardEffect, PilotCard } from "@tcg/gundam-types";

export const gd02FourMurasame085: PilotCard = {
  cardNumber: "GD02-085",
  name: "Four Murasame",
  type: "pilot",
  color: "blue",
  traits: ["titans", "cyber-newtype"],
  id: "GD02-085",
  externalId: "gundam:gd02-085",
  slug: "four-murasame-gd02-085",
  displayName: "Four Murasame",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-085",
  printings: [
    {
      id: "GD02-085",
      collectorNumber: "GD02-085",
      cardNumber: "GD02-085",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-085.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-085.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-085_p1",
      collectorNumber: "GD02-085_p1",
      cardNumber: "GD02-085",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-085_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-085_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-085",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-085.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-085.webp?260424",
  legality: "legal",
  level: 5,
  cost: 1,
  apBonus: 2,
  hpBonus: 1,
  effect:
    "【Burst】Add this card to your hand.<br>【During Link】【Once per Turn】During your turn, when this Unit recovers HP, if you have 4 or less cards in your hand, draw 1.<br>",
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
        timing: ["whenHealed"],
        restrictions: [{ type: "oncePerTurn" }],
        conditions: [
          { type: "duringLink" },
          { type: "isTurn", whose: "friendly" },
          { type: "handCount", owner: "friendly", comparison: "lte", count: 4 },
        ],
      },
      directives: [
        {
          action: {
            action: "draw",
            count: 1,
          },
        },
      ],
      sourceText:
        "【During Link】【Once per Turn】During your turn, when this Unit recovers HP, if you have 4 or less cards in your hand, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
