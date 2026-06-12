import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01JusticeGundam066: UnitCard = {
  cardNumber: "GD01-066",
  name: "Justice Gundam",
  type: "unit",
  color: "white",
  traits: ["triple ship alliance"],
  id: "GD01-066",
  externalId: "gundam:gd01-066",
  slug: "justice-gundam-gd01-066",
  displayName: "Justice Gundam",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-066",
  printings: [
    {
      id: "GD01-066",
      collectorNumber: "GD01-066",
      cardNumber: "GD01-066",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-066.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-066.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-066_p1",
      collectorNumber: "GD01-066_p1",
      cardNumber: "GD01-066",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-066_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-066_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-066",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-066.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-066.webp?260424",
  legality: "legal",
  level: 7,
  cost: 5,
  ap: 5,
  hp: 5,
  linkCondition: "[Athrun Zala]",
  effect:
    "【Deploy】Deploy 1 [Fatum-00]((Triple Ship Alliance)･AP2･HP2･<Blocker>) Unit token.\n【During Pair】【Attack】Choose 1 of your (Triple Ship Alliance) Unit tokens. It may attack on the turn it is deployed.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "deployToken",
            token: {
              name: "Fatum-00",
              traits: ["triple ship alliance"],
              ap: 2,
              hp: 2,
              keywordEffects: [
                {
                  keyword: "Blocker",
                },
              ],
              deployState: "active",
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Deploy 1 [Fatum-00]((Triple Ship Alliance)·AP2·HP2·<Blocker>) Unit token.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [{ type: "duringPair" }, { type: "eventSourceIsSelf" }],
      },
      directives: [
        {
          action: {
            action: "allowAttackDeployedThisTurn",
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              isToken: true,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "triple ship alliance",
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【During Pair】【Attack】Choose 1 of your (Triple Ship Alliance) Unit tokens. It may attack on the turn it is deployed.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
