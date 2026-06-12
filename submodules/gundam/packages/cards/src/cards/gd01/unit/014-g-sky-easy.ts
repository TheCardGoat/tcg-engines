import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01GSkyEasy014: UnitCard = {
  cardNumber: "GD01-014",
  name: "G-Sky Easy",
  type: "unit",
  color: "blue",
  traits: ["earth federation", "white base team"],
  id: "GD01-014",
  externalId: "gundam:gd01-014",
  slug: "g-sky-easy-gd01-014",
  displayName: "G-Sky Easy",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-014",
  printings: [
    {
      id: "GD01-014",
      collectorNumber: "GD01-014",
      cardNumber: "GD01-014",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-014.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-014.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-014",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-014.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-014.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 1,
  hp: 3,
  linkCondition: "[Amuro Ray]",
  effect: "【During Link】【Activate･Action】【Once per Turn】Choose 1 Unit. It recovers 1 HP.<br>",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:action"],
        restrictions: [{ type: "oncePerTurn" }],
        conditions: [{ type: "duringLink" }],
      },
      directives: [
        {
          action: {
            action: "recoverHP",
            amount: 1,
            target: {
              owner: "any",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【During Link】【Activate·Action】【Once per Turn】Choose 1 Unit. It recovers 1 HP.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
