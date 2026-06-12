import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02Elmeth020: UnitCard = {
  cardNumber: "GD02-020",
  name: "Elmeth",
  type: "unit",
  color: "green",
  traits: ["zeon"],
  id: "GD02-020",
  externalId: "gundam:gd02-020",
  slug: "elmeth-gd02-020",
  displayName: "Elmeth",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-020",
  printings: [
    {
      id: "GD02-020",
      collectorNumber: "GD02-020",
      cardNumber: "GD02-020",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-020.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-020.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-020_p1",
      collectorNumber: "GD02-020_p1",
      cardNumber: "GD02-020",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "legendRare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-020_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-020_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-020",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-020.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-020.webp?260424",
  legality: "legal",
  level: 6,
  cost: 5,
  ap: 4,
  hp: 4,
  linkCondition: "[Lalah Sune]",
  effect:
    "【Deploy】Look at the top 5 cards of your deck. You may reveal 1 green (Zeon) Pilot card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.\n【During Link】 This Unit gets AP+2.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "lookAtTopDeck",
            count: 5,
            return: "chooseTop",
            tutorFilter: {
              owner: "friendly",
              cardType: "pilot",
              attributeFilters: [
                { attribute: "color", comparison: "eq", value: "green" },
                { attribute: "trait", comparison: "includes", value: "zeon" },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Deploy】Look at the top 5 cards of your deck. You may reveal 1 green (Zeon) Pilot card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
    },
    {
      type: "constant",
      activation: {
        conditions: [{ type: "duringLink" }],
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
      sourceText: "【During Link】 This Unit gets AP+2.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "legendRare",
};
