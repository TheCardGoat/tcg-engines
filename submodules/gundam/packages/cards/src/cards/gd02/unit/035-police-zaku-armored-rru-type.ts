import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02PoliceZakuArmoredRruType035: UnitCard = {
  cardNumber: "GD02-035",
  name: "Police Zaku (Armored RRU Type)",
  type: "unit",
  color: "green",
  traits: ["side 6"],
  id: "GD02-035",
  externalId: "gundam:gd02-035",
  slug: "police-zaku-armored-rru-type-gd02-035",
  displayName: "Police Zaku (Armored RRU Type)",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-035",
  printings: [
    {
      id: "GD02-035",
      collectorNumber: "GD02-035",
      cardNumber: "GD02-035",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-035.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-035.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-035",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-035.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-035.webp?260424",
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
