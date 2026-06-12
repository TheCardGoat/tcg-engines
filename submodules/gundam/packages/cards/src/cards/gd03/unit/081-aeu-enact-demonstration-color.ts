import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03AeuEnactDemonstrationColor081: UnitCard = {
  cardNumber: "GD03-081",
  name: "AEU Enact Demonstration Color",
  type: "unit",
  color: "white",
  traits: ["superpower bloc"],
  id: "GD03-081",
  externalId: "gundam:gd03-081",
  slug: "aeu-enact-demonstration-color-gd03-081",
  displayName: "AEU Enact Demonstration Color",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-081",
  printings: [
    {
      id: "GD03-081",
      collectorNumber: "GD03-081",
      cardNumber: "GD03-081",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-081.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-081.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-081_p1",
      collectorNumber: "GD03-081_p1",
      cardNumber: "GD03-081",
      set: {
        code: "GD03",
        name: "Store Tournament Participant Pack 03",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-081_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-081_p1.webp?260424",
      productName: "Store Tournament Participant Pack 03",
    },
    {
      id: "GD03-081_p2",
      collectorNumber: "GD03-081_p2",
      cardNumber: "GD03-081",
      set: {
        code: "GD03",
        name: "Store Tournament Winner Pack 03",
        packageId: "616901",
      },
      rarity: "common",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-081_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-081_p2.webp?260424",
      productName: "Store Tournament Winner Pack 03",
    },
  ],
  selectedPrintingId: "GD03-081",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-081.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-081.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  ap: 2,
  hp: 1,
  linkCondition: "(Superpower Bloc) Trait",
  effect:
    "This Unit can only attack during a turn when one of your (Superpower Bloc)/(UN) Units is deployed.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "deployedThisTurnCount",
            owner: "friendly",
            cardType: "unit",
            comparison: "eq",
            count: 0,
            attributeFilters: [
              {
                attribute: "or",
                filters: [
                  { attribute: "trait", comparison: "includes", value: "superpower bloc" },
                  { attribute: "trait", comparison: "includes", value: "un" },
                ],
              },
            ],
          },
        ],
      },
      directives: [
        {
          action: {
            action: "cantAttack",
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText:
        "This Unit can only attack during a turn when one of your (Superpower Bloc)/(UN) Units is deployed.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
