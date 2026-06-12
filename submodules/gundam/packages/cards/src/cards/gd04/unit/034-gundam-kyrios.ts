import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04GundamKyrios034: UnitCard = {
  cardNumber: "GD04-034",
  name: "Gundam Kyrios",
  type: "unit",
  color: "red",
  traits: ["cb", "gn drive"],
  id: "GD04-034",
  externalId: "gundam:gd04-034",
  slug: "gundam-kyrios-gd04-034",
  displayName: "Gundam Kyrios",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-034",
  printings: [
    {
      id: "GD04-034",
      collectorNumber: "GD04-034",
      cardNumber: "GD04-034",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-034.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-034.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-034_p1",
      collectorNumber: "GD04-034_p1",
      cardNumber: "GD04-034",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-034_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-034_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-034",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-034.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-034.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 1,
  hp: 4,
  linkCondition: "[Allelujah Haptism] / [Hallelujah Haptism]",
  effect:
    "<First Strike> (While this Unit is attacking, it deals damage before the enemy Unit.)\n【During Link】This Unit gets AP+2 for each of your rested (CB) Units.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [{ type: "duringLink" }],
      },
      directives: [
        {
          action: {
            action: "statModifierByCount",
            countFilter: {
              owner: "friendly",
              cardType: "unit",
              state: "rested",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "cb",
                },
              ],
            },
            stat: "ap",
            amountPerMatch: 2,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText: "【During Link】This Unit gets AP+2 for each of your rested (CB) Units.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "FirstStrike" }],
  rarity: "legendRare",
};
