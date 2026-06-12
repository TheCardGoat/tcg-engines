import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01DuoSLeo042: UnitCard = {
  cardNumber: "GD01-042",
  name: "Duo's Leo",
  type: "unit",
  color: "green",
  traits: ["operation meteor"],
  id: "GD01-042",
  externalId: "gundam:gd01-042",
  slug: "duo-s-leo-gd01-042",
  displayName: "Duo's Leo",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-042",
  printings: [
    {
      id: "GD01-042",
      collectorNumber: "GD01-042",
      cardNumber: "GD01-042",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-042.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-042.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-042",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-042.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-042.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 2,
  hp: 2,
  effect:
    "This Unit may choose an active enemy Unit that is Lv.2 or lower as its attack target.<br>",
  effects: [
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "chooseAttackTarget",
            unit: {
              owner: "self",
              cardType: "unit",
            },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "This Unit may choose an active enemy Unit that is Lv.2 or lower as its attack target.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
