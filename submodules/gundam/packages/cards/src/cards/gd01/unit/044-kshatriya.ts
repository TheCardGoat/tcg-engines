import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd01Kshatriya044: UnitCard = {
  cardNumber: "GD01-044",
  name: "Kshatriya",
  type: "unit",
  color: "red",
  traits: ["neo zeon"],
  id: "GD01-044",
  externalId: "gundam:gd01-044",
  slug: "kshatriya-gd01-044",
  displayName: "Kshatriya",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-044",
  printings: [
    {
      id: "GD01-044",
      collectorNumber: "GD01-044",
      cardNumber: "GD01-044",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-044.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-044.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
    {
      id: "GD01-044_p1",
      collectorNumber: "GD01-044_p1",
      cardNumber: "GD01-044",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-044_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-044_p1.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-044",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-044.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-044.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 5,
  hp: 4,
  linkCondition: "[Marida Cruz]",
  effect:
    "【When Paired･(Cyber-Newtype)/(Newtype) Pilot】Choose 1 to 2 enemy Units. Deal 1 damage to them.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
        qualification: {
          attribute: "or",
          filters: [
            { attribute: "trait", comparison: "includes", value: "Cyber-Newtype" },
            { attribute: "trait", comparison: "includes", value: "Newtype" },
          ],
        },
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: { min: 1, max: 2 },
            },
          },
        },
      ],
      sourceText:
        "【When Paired･(Cyber-Newtype)/(Newtype) Pilot】Choose 1 to 2 enemy Units. Deal 1 damage to them.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
