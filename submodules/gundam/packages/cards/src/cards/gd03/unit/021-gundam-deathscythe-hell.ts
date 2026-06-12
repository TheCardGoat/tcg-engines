import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GundamDeathscytheHell021: UnitCard = {
  cardNumber: "GD03-021",
  name: "Gundam Deathscythe Hell",
  type: "unit",
  color: "green",
  traits: ["g team"],
  id: "GD03-021",
  externalId: "gundam:gd03-021",
  slug: "gundam-deathscythe-hell-gd03-021",
  displayName: "Gundam Deathscythe Hell",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-021",
  printings: [
    {
      id: "GD03-021",
      collectorNumber: "GD03-021",
      cardNumber: "GD03-021",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-021.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-021.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-021_p1",
      collectorNumber: "GD03-021_p1",
      cardNumber: "GD03-021",
      set: {
        code: "GD03",
        name: "Store Tournament Participant Pack 03",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-021_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-021_p1.webp?260424",
      productName: "Store Tournament Participant Pack 03",
    },
    {
      id: "GD03-021_p2",
      collectorNumber: "GD03-021_p2",
      cardNumber: "GD03-021",
      set: {
        code: "GD03",
        name: "Store Tournament Winner Pack 03",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-021_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-021_p2.webp?260424",
      productName: "Store Tournament Winner Pack 03",
    },
  ],
  selectedPrintingId: "GD03-021",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-021.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-021.webp?260424",
  legality: "legal",
  level: 8,
  cost: 7,
  ap: 6,
  hp: 5,
  linkCondition: "[Duo Maxwell]",
  effect:
    "【Deploy】Choose 1 of your (Operation Meteor)/(G Team) Units. During this turn, it may choose an active enemy Unit as its attack target.",
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
              attributeFilters: [
                {
                  attribute: "or",
                  filters: [
                    {
                      attribute: "trait",
                      comparison: "includes",
                      value: "operation meteor",
                    },
                    {
                      attribute: "trait",
                      comparison: "includes",
                      value: "g team",
                    },
                  ],
                },
              ],
            },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Choose 1 of your (Operation Meteor)/(G Team) Units. During this turn, it may choose an active enemy Unit as its attack target.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
