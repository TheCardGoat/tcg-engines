import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd03GundamBarbatosLupus050: UnitCard = {
  cardNumber: "GD03-050",
  name: "Gundam Barbatos Lupus",
  type: "unit",
  color: "purple",
  traits: ["tekkadan", "gundam frame"],
  id: "GD03-050",
  externalId: "gundam:gd03-050",
  slug: "gundam-barbatos-lupus-gd03-050",
  displayName: "Gundam Barbatos Lupus",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-050",
  printings: [
    {
      id: "GD03-050",
      collectorNumber: "GD03-050",
      cardNumber: "GD03-050",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-050.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-050.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-050_p1",
      collectorNumber: "GD03-050_p1",
      cardNumber: "GD03-050",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-050_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-050_p1.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
    {
      id: "GD03-050_p3",
      collectorNumber: "GD03-050_p3",
      cardNumber: "GD03-050",
      set: {
        code: "GD03",
        name: "NEWTYPE CHALLENGE 2026 MISSION 3 Winner Prize",
        packageId: "616901",
      },
      rarity: "legendRare",
      finish: "parallel",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-050_p3.webp?260424",
      productName: "NEWTYPE CHALLENGE 2026 MISSION 3 Winner Prize",
    },
  ],
  selectedPrintingId: "GD03-050",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-050.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-050.webp?260424",
  legality: "legal",
  level: 7,
  cost: 6,
  ap: 5,
  hp: 5,
  linkCondition: "[Mikazuki Augus]",
  effect:
    "【Activate･Main】Choose 3 (Tekkadan)/(Teiwaz) Unit cards from your trash. Exile them from the game. If you do, choose 1 enemy Unit. Deal 2 damage to it.",
  effects: [
    {
      type: "activated",
      activation: {
        timing: ["activate:main"],
      },
      directives: [
        {
          action: {
            action: "exile",
            target: {
              owner: "friendly",
              cardType: "unit",
              zone: "trash",
              attributeFilters: [
                {
                  attribute: "or",
                  filters: [
                    {
                      attribute: "trait",
                      comparison: "includes",
                      value: "tekkadan",
                    },
                    {
                      attribute: "trait",
                      comparison: "includes",
                      value: "teiwaz",
                    },
                  ],
                },
              ],
              count: 3,
            },
          },
        },
        {
          action: {
            action: "dealDamage",
            amount: 2,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText:
        "【Activate·Main】Choose 3 (Tekkadan)/(Teiwaz) Unit cards from your trash. Exile them from the game. If you do, choose 1 enemy Unit. Deal 2 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
