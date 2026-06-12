import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01GundamPharact071: UnitCard = {
  cardNumber: "GD01-071",
  name: "Gundam Pharact",
  type: "unit",
  color: "white",
  traits: ["academy"],
  id: "GD01-071",
  externalId: "gundam:gd01-071",
  slug: "gundam-pharact-gd01-071",
  displayName: "Gundam Pharact",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-071",
  printings: [
    {
      id: "GD01-071",
      collectorNumber: "GD01-071",
      cardNumber: "GD01-071",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-071.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-071.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-071_p1",
      collectorNumber: "GD01-071_p1",
      cardNumber: "GD01-071",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-071_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-071_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-071",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-071.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-071.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 3,
  hp: 4,
  effect: "【During Link】【Attack】Choose 1 enemy Unit. It gets AP-2 during this battle.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [{ type: "duringLink" }],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -2,
            duration: "thisBattle",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【During Link】【Attack】Choose 1 enemy Unit. It gets AP-2 during this battle.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
