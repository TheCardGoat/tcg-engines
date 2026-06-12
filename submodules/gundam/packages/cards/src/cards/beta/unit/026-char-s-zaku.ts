import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const betaCharSZaku026: UnitCard = {
  cardNumber: "GD01-026",
  name: "Char's Zaku Ⅱ",
  type: "unit",
  color: "green",
  traits: ["zeon"],
  id: "GD01-026_p1",
  externalId: "gundam:gd01-026_p1",
  slug: "char-s-zaku-gd01-026-p1",
  displayName: "Char's Zaku Ⅱ",
  set: { code: "BETA", name: "Edition Beta", packageId: "616000" },
  printNumber: "GD01-026_p1",
  printings: [
    {
      id: "GD01-026",
      collectorNumber: "GD01-026",
      cardNumber: "GD01-026",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-026.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-026.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-026_p1",
      collectorNumber: "GD01-026_p1",
      cardNumber: "GD01-026",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-026_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-026_p1.webp?260424",
      productName: "Edition Beta",
    },
    {
      id: "GD01-026_p2",
      collectorNumber: "GD01-026_p2",
      cardNumber: "GD01-026",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-026_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-026_p2.webp?260424",
      productName: "Edition Beta",
    },
  ],
  selectedPrintingId: "GD01-026_p1",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-026_p1.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-026_p1.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 3,
  hp: 2,
  effect:
    "【During Pair】【Destroyed】Deploy 1 rested [Char's Zaku Ⅱ]((Zeon)･AP3･HP1) Unit token.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
        conditions: [{ type: "duringPair" }],
      },
      directives: [
        {
          action: {
            action: "deployToken",
            token: {
              name: "Char's Zaku Ⅱ",
              traits: ["zeon"],
              ap: 3,
              hp: 1,
              deployState: "rested",
              printedCardNumber: "T-006",
            },
          },
        },
      ],
      sourceText:
        "【During Pair】【Destroyed】Deploy 1 rested [Char's Zaku Ⅱ]((Zeon)·AP3·HP1) Unit token.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
