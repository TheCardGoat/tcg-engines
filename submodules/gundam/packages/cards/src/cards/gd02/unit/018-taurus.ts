import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02Taurus018: UnitCard = {
  cardNumber: "GD02-018",
  name: "Taurus",
  type: "unit",
  color: "blue",
  traits: ["oz"],
  id: "GD02-018",
  externalId: "gundam:gd02-018",
  slug: "taurus-gd02-018",
  displayName: "Taurus",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-018",
  printings: [
    {
      id: "GD02-018",
      collectorNumber: "GD02-018",
      cardNumber: "GD02-018",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-018.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-018.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-018",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-018.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-018.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 3,
  hp: 3,
  effect: "This Unit can't choose the enemy player as its attack target.<br>",
  effects: [
    {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "cantTargetPlayer",
            whose: "opponent",
          },
        },
      ],
      sourceText: "This Unit can't choose the enemy player as its attack target.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
