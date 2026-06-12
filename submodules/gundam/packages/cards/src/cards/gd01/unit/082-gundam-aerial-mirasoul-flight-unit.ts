import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01GundamAerialMirasoulFlightUnit082: UnitCard = {
  cardNumber: "GD01-082",
  name: "Gundam Aerial (Mirasoul Flight Unit)",
  type: "unit",
  color: "white",
  traits: ["academy"],
  id: "GD01-082",
  externalId: "gundam:gd01-082",
  slug: "gundam-aerial-mirasoul-flight-unit-gd01-082",
  displayName: "Gundam Aerial (Mirasoul Flight Unit)",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-082",
  printings: [
    {
      id: "GD01-082",
      collectorNumber: "GD01-082",
      cardNumber: "GD01-082",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-082.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-082.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-082",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-082.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-082.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 3,
  effect:
    "【During Pair】【Activate･Action】【Once per Turn】②：Choose 1 enemy Unit. It gets AP-1 during this battle.<br>",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:action"],
        restrictions: [{ type: "oncePerTurn" }],
        conditions: [{ type: "duringPair" }],
      },
      cost: {
        payResources: 2,
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -1,
            duration: "thisBattle",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【During Pair】【Activate·Action】【Once per Turn】②：Choose 1 enemy Unit. It gets AP-1 during this battle.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
