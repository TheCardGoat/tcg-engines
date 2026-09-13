import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01ChuchuSDemiTrainer074: UnitCard = {
  cardNumber: "GD01-074",
  name: "Chuchu's Demi Trainer",
  type: "unit",
  battlefieldZones: ["space", "earth"],
  color: "white",
  traits: ["academy"],
  id: "GD01-074",
  canonicalId: "GD01-074",
  externalIds: { bandai: "gundam:gd01-074" },
  slug: "chuchu-s-demi-trainer/gd01-074",
  displayName: "Chuchu's Demi Trainer",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-074",
  printings: [
    {
      id: "GD01-074",
      artId: "GD01-074",
      setCode: "GD01",
      collectorNumber: "GD01-074",
      cardNumber: "GD01-074",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd01/GD01-074.webp",
      productName: "Newtype Rising [GD01]",
    },
  ],
  reprints: ["GD01-074"],
  selectedPrintingId: "GD01-074",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/gd01/GD01-074.webp",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 3,
  hp: 1,
  linkCondition: "[Chuatury Panlunch]",
  effect: "【Attack】Draw 1. Then, discard 1.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "drawThenDiscard",
            drawCount: 1,
            discardCount: 1,
          },
        },
      ],
      sourceText: "【Attack】Draw 1. Then, discard 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
