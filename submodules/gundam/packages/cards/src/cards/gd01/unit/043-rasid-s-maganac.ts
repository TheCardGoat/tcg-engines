import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01RasidSMaganac043: UnitCard = {
  cardNumber: "GD01-043",
  name: "Rasid's Maganac",
  type: "unit",
  color: "green",
  traits: ["maganac corps"],
  id: "GD01-043",
  externalId: "gundam:gd01-043",
  slug: "rasid-s-maganac-gd01-043",
  displayName: "Rasid's Maganac",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-043",
  printings: [
    {
      id: "GD01-043",
      collectorNumber: "GD01-043",
      cardNumber: "GD01-043",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-043.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-043.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-043",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-043.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-043.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 3,
  effect:
    "【Deploy】Choose 1 of your green Units. During this turn, it may choose an active enemy Unit with 4 or less AP as its attack target.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "color", comparison: "eq", value: "green" }],
            },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              attributeFilters: [
                {
                  attribute: "ap",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
            duration: "thisTurn",
          },
        },
      ],
      sourceText:
        "【Deploy】Choose 1 of your green Units. During this turn, it may choose an active enemy Unit with 4 or less AP as its attack target.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
