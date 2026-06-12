import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02Gabthley008: UnitCard = {
  cardNumber: "GD02-008",
  name: "Gabthley",
  type: "unit",
  color: "blue",
  traits: ["titans"],
  id: "GD02-008",
  externalId: "gundam:gd02-008",
  slug: "gabthley-gd02-008",
  displayName: "Gabthley",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-008",
  printings: [
    {
      id: "GD02-008",
      collectorNumber: "GD02-008",
      cardNumber: "GD02-008",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-008.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-008.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-008",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-008.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-008.webp?260424",
  legality: "legal",
  level: 4,
  cost: 3,
  ap: 4,
  hp: 3,
  linkCondition: "[Jerid Messa]",
  effect: "【When Linked】Choose 1 rested enemy Unit. Deal 1 damage to it.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["whenLinked"],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              state: "rested",
              count: 1,
            },
          },
        },
      ],
      sourceText: "【When Linked】Choose 1 rested enemy Unit. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
