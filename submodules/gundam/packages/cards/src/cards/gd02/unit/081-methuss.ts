import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02Methuss081: UnitCard = {
  cardNumber: "GD02-081",
  name: "Methuss",
  type: "unit",
  color: "white",
  traits: ["aeug"],
  id: "GD02-081",
  externalId: "gundam:gd02-081",
  slug: "methuss-gd02-081",
  displayName: "Methuss",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-081",
  printings: [
    {
      id: "GD02-081",
      collectorNumber: "GD02-081",
      cardNumber: "GD02-081",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-081.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-081.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-081",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-081.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-081.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 1,
  hp: 1,
  effect:
    "【Deploy】If a friendly white Base is in play, choose 1 enemy Unit. It gets AP-2 during this turn.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          condition: {
            type: "friendlyBaseInPlay",
            color: "white",
          },
          thenDirectives: [
            {
              action: {
                action: "statModifier",
                stat: "ap",
                amount: -2,
                duration: "thisTurn",
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
        "【Deploy】If a friendly white Base is in play, choose 1 enemy Unit. It gets AP-2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
