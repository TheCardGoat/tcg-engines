import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03ZGundamBiosensor071: UnitCard = {
  cardNumber: "GD03-071",
  name: "Z Gundam (Biosensor)",
  type: "unit",
  color: "white",
  traits: ["aeug"],
  id: "GD03-071",
  externalId: "gundam:gd03-071",
  slug: "z-gundam-biosensor-gd03-071",
  displayName: "Z Gundam (Biosensor)",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-071",
  printings: [
    {
      id: "GD03-071",
      collectorNumber: "GD03-071",
      cardNumber: "GD03-071",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-071.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-071.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-071_p1",
      collectorNumber: "GD03-071_p1",
      cardNumber: "GD03-071",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-071_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-071_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-071",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-071.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-071.webp?260424",
  legality: "legal",
  level: 7,
  cost: 5,
  ap: 5,
  hp: 5,
  linkCondition: "[Kamille Bidan]",
  effect:
    "【Deploy】Choose 1 enemy Unit. For each (AEUG) Unit card in your trash, it gets AP-1 during this turn.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "statModifierByCount",
            countFilter: {
              owner: "friendly",
              cardType: "unit",
              zone: "trash",
              attributeFilters: [{ attribute: "trait", comparison: "includes", value: "aeug" }],
            },
            stat: "ap",
            amountPerMatch: -1,
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
        "【Deploy】Choose 1 enemy Unit. For each (AEUG) Unit card in your trash, it gets AP-1 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
