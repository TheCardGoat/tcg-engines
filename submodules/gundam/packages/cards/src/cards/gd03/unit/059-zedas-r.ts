import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03ZedasR059: UnitCard = {
  cardNumber: "GD03-059",
  name: "Zedas R",
  type: "unit",
  color: "purple",
  traits: ["vagan"],
  id: "GD03-059",
  externalId: "gundam:gd03-059",
  slug: "zedas-r-gd03-059",
  displayName: "Zedas R",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-059",
  printings: [
    {
      id: "GD03-059",
      collectorNumber: "GD03-059",
      cardNumber: "GD03-059",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-059.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-059.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-059",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-059.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-059.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 3,
  linkCondition: "(X-Rounder) Trait",
  effect:
    "【Attack】You may choose 1 (Vagan) card from your trash. Exile it from the game. If you do, choose 1 of your (Vagan) Units. It gets AP+2 during this turn.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "exile",
            target: {
              owner: "friendly",
              zone: "trash",
              count: 1,
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "vagan" }],
            },
          },
          optional: true,
        },
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "vagan",
                },
              ],
              count: 1,
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Attack】You may choose 1 (Vagan) card from your trash. Exile it from the game. If you do, choose 1 of your (Vagan) Units. It gets AP+2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
