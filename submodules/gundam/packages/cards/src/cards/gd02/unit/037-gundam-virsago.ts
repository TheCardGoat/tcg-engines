import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GundamVirsago037: UnitCard = {
  cardNumber: "GD02-037",
  name: "Gundam Virsago",
  type: "unit",
  color: "red",
  traits: ["new une"],
  id: "GD02-037",
  externalId: "gundam:gd02-037",
  slug: "gundam-virsago-gd02-037",
  displayName: "Gundam Virsago",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-037",
  printings: [
    {
      id: "GD02-037",
      collectorNumber: "GD02-037",
      cardNumber: "GD02-037",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-037.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-037.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-037_p1",
      collectorNumber: "GD02-037_p1",
      cardNumber: "GD02-037",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-037_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-037_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-037",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-037.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-037.webp?260424",
  legality: "legal",
  level: 5,
  cost: 4,
  ap: 4,
  hp: 4,
  linkCondition: "[Shagia Frost]",
  effect:
    "<Breach 1> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)\n【Deploy】If there are 3 or less enemy Shields, choose 1 enemy Unit with 5 or less AP. Deal 2 damage to it.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
        conditions: [
          {
            type: "cardInZone",
            owner: "opponent",
            zone: "shieldArea",
            comparison: "lte",
            count: 3,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 2,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "ap", comparison: "lte", value: 5 }],
            },
          },
        },
      ],
      sourceText:
        "【Deploy】If there are 3 or less enemy Shields, choose 1 enemy Unit with 5 or less AP. Deal 2 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Breach", value: 1 }],
  rarity: "legendRare",
};
