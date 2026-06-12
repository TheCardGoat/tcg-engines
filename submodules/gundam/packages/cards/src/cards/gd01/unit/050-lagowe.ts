import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01Lagowe050: UnitCard = {
  cardNumber: "GD01-050",
  name: "LaGOWE",
  type: "unit",
  color: "red",
  traits: ["zaft"],
  id: "GD01-050",
  externalId: "gundam:gd01-050",
  slug: "lagowe-gd01-050",
  displayName: "LaGOWE",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-050",
  printings: [
    {
      id: "GD01-050",
      collectorNumber: "GD01-050",
      cardNumber: "GD01-050",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-050.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-050.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-050_p1",
      collectorNumber: "GD01-050_p1",
      cardNumber: "GD01-050",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-050_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-050_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-050",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-050.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-050.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 2,
  hp: 3,
  effect:
    "【Attack】If this Unit has 5 or more AP and it is attacking an enemy Unit, choose 1 enemy Unit. Deal 2 damage to it.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          condition: {
            type: "and",
            conditions: [
              {
                type: "selfStat",
                stat: "ap",
                comparison: "gte",
                value: 5,
              },
              {
                type: "selfIsAttacking",
              },
            ],
          },
          thenDirectives: [
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
            },
          ],
        },
      ],
      sourceText:
        "【Attack】If this Unit has 5 or more AP and it is attacking an enemy Unit, choose 1 enemy Unit. Deal 2 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
