import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01BusterGundam046: UnitCard = {
  cardNumber: "GD01-046",
  name: "Buster Gundam",
  type: "unit",
  color: "red",
  traits: ["zaft"],
  id: "GD01-046",
  externalId: "gundam:gd01-046",
  slug: "buster-gundam-gd01-046",
  displayName: "Buster Gundam",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-046",
  printings: [
    {
      id: "GD01-046",
      collectorNumber: "GD01-046",
      cardNumber: "GD01-046",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-046.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-046.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-046_p1",
      collectorNumber: "GD01-046_p1",
      cardNumber: "GD01-046",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-046_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-046_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-046",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-046.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-046.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  ap: 1,
  hp: 4,
  linkCondition: "[Dearka Elthman]",
  effect:
    "【Activate･Main】<Support 3> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)\n【During Pair･(Coordinator) Pilot】【Once per Turn】When you use this Unit's <Support> to increase a (ZAFT) Unit's AP, set this Unit as active.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["onSupportUsed"],
        conditions: [
          { type: "duringPair" },
          { type: "selfPairedPilotHasTrait", trait: "coordinator" },
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "zaft" }],
            },
          },
        ],
        restrictions: [{ type: "oncePerTurn" }],
      },
      directives: [
        {
          action: {
            action: "setActive",
            target: { owner: "self", cardType: "unit", state: "rested" },
          },
        },
      ],
      sourceText:
        "【During Pair･(Coordinator) Pilot】【Once per Turn】When you use this Unit's <Support> to increase a (ZAFT) Unit's AP, set this Unit as active.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Support", value: 3 }],
  rarity: "legendRare",
};
