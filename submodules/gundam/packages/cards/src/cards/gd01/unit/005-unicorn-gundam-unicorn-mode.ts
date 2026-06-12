import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01UnicornGundamUnicornMode005: UnitCard = {
  cardNumber: "GD01-005",
  name: "Unicorn Gundam (Unicorn Mode)",
  type: "unit",
  color: "blue",
  traits: ["civilian"],
  id: "GD01-005",
  externalId: "gundam:gd01-005",
  slug: "unicorn-gundam-unicorn-mode-gd01-005",
  displayName: "Unicorn Gundam (Unicorn Mode)",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-005",
  printings: [
    {
      id: "GD01-005",
      collectorNumber: "GD01-005",
      cardNumber: "GD01-005",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-005.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-005.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-005_p1",
      collectorNumber: "GD01-005_p1",
      cardNumber: "GD01-005",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-005_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-005_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-005_p2",
      collectorNumber: "GD01-005_p2",
      cardNumber: "GD01-005",
      set: {
        code: "BETA",
        name: "Edition Beta",
        packageId: "616000",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/beta/GD01-005_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-005_p2.webp?260424",
      productName: "Edition Beta",
    },
    {
      id: "GD01-005_p3",
      collectorNumber: "GD01-005_p3",
      cardNumber: "GD01-005",
      set: {
        code: "GD01",
        name: "GUNDAM CARD GAME Booster Pack Launch Event",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-005_p3.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-005_p3.webp?260424",
      productName: "GUNDAM CARD GAME Booster Pack Launch Event",
    },
  ],
  selectedPrintingId: "GD01-005",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-005.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-005.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 3,
  effect:
    "【During Link】【Destroyed】Return this Unit's paired Pilot to its owner's hand. Then, discard 1.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
        conditions: [{ type: "duringLink" }],
      },
      directives: [
        {
          action: {
            action: "discard",
            count: 1,
          },
        },
      ],
      sourceText:
        "【During Link】【Destroyed】Return this Unit's paired Pilot to its owner's hand. Then, discard 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
