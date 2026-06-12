import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02GundamX053: UnitCard = {
  cardNumber: "GD02-053",
  name: "Gundam X",
  type: "unit",
  color: "purple",
  traits: ["vulture"],
  id: "GD02-053",
  externalId: "gundam:gd02-053",
  slug: "gundam-x-gd02-053",
  displayName: "Gundam X",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-053",
  printings: [
    {
      id: "GD02-053",
      collectorNumber: "GD02-053",
      cardNumber: "GD02-053",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-053.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-053.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-053_p1",
      collectorNumber: "GD02-053_p1",
      cardNumber: "GD02-053",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-053_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-053_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-053",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-053.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-053.webp?260424",
  legality: "legal",
  level: 7,
  cost: 5,
  ap: 6,
  hp: 5,
  linkCondition: "[Garrod Ran]",
  effect:
    "[Suppression] (Damage to Shields by an attack is dealt to the first 2 cards simultaneously.)\n【During Link】During your turn, while there are 7 or more cards in your trash, all your other (Vulture) Units get AP+2.",
  effects: [
    {
      type: "constant",
      activation: {
        conditions: [
          { type: "duringLink" },
          { type: "isTurn", whose: "friendly" },
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: 7,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "permanent",
            target: {
              owner: "friendly",
              cardType: "unit",
              excludeSource: true,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "vulture",
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【During Link】During your turn, while there are 7 or more cards in your trash, all your other (Vulture) Units get AP+2.",
    },
  ] as CardEffect[],
  keywordEffects: [{ keyword: "Suppression" }],
  rarity: "legendRare",
};
