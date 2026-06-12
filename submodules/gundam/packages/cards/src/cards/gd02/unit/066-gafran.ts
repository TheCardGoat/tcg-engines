import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02Gafran066: UnitCard = {
  cardNumber: "GD02-066",
  name: "Gafran",
  type: "unit",
  color: "purple",
  traits: ["ue", "vagan"],
  id: "GD02-066",
  externalId: "gundam:gd02-066",
  slug: "gafran-gd02-066",
  displayName: "Gafran",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-066",
  printings: [
    {
      id: "GD02-066",
      collectorNumber: "GD02-066",
      cardNumber: "GD02-066",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-066.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-066.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-066",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-066.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-066.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  ap: 2,
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
