import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02Gquuuuuux034: UnitCard = {
  cardNumber: "GD02-034",
  name: "GQuuuuuuX",
  type: "unit",
  color: "green",
  traits: ["zeon"],
  id: "GD02-034",
  externalId: "gundam:gd02-034",
  slug: "gquuuuuux-gd02-034",
  displayName: "GQuuuuuuX",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-034",
  printings: [
    {
      id: "GD02-034",
      collectorNumber: "GD02-034",
      cardNumber: "GD02-034",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-034.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-034.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-034",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-034.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-034.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  ap: 0,
  hp: 3,
  effect: "【During Pair･Red Pilot】This Unit gets AP+2.<br>",
  effects: [
    {
      type: "constant",
      activation: {
        qualification: { attribute: "color", comparison: "eq", value: "red" },
        conditions: [{ type: "duringPair" }],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "permanent",
            target: {
              owner: "self",
              cardType: "unit",
            },
          },
        },
      ],
      sourceText: "【During Pair·Red Pilot】This Unit gets AP+2.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
