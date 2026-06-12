import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01FreedomGundam065: UnitCard = {
  cardNumber: "GD01-065",
  name: "Freedom Gundam",
  type: "unit",
  color: "white",
  traits: ["triple ship alliance"],
  id: "GD01-065",
  externalId: "gundam:gd01-065",
  slug: "freedom-gundam-gd01-065",
  displayName: "Freedom Gundam",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-065",
  printings: [
    {
      id: "GD01-065",
      collectorNumber: "GD01-065",
      cardNumber: "GD01-065",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-065.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-065.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-065_p1",
      collectorNumber: "GD01-065_p1",
      cardNumber: "GD01-065",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-065_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-065_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-065_p2",
      collectorNumber: "GD01-065_p2",
      cardNumber: "GD01-065",
      set: {
        code: "GD01",
        name: "Newtype Challenge 2026 Mission 1",
        packageId: "616901",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-065_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-065_p2.webp?260424",
      productName: "Newtype Challenge 2026 Mission 1",
    },
  ],
  selectedPrintingId: "GD01-065",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-065.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-065.webp?260424",
  legality: "legal",
  level: 7,
  cost: 5,
  ap: 4,
  hp: 6,
  linkCondition: "[Kira Yamato]",
  effect:
    "<Blocker> (Rest this Unit to change the attack target to it.)\n【During Pair】【Once per Turn】When you pair a Pilot with this Unit or one of your white Units, choose 1 enemy Unit. It gets AP-2 during this turn.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
        conditions: [
          { type: "duringPair" },
          { type: "eventPlayerIsSelf" },
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [{ attribute: "color", comparison: "eq", value: "white" }],
            },
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -2,
            duration: "thisTurn",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【During Pair】【Once per Turn】When you pair a Pilot with this Unit or one of your white Units, choose 1 enemy Unit. It gets AP-2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Blocker" }],
  rarity: "legendRare",
};
