import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd02DaughtressCommand044: UnitCard = {
  cardNumber: "GD02-044",
  name: "Daughtress Command",
  type: "unit",
  color: "red",
  traits: ["new une"],
  id: "GD02-044",
  externalId: "gundam:gd02-044",
  slug: "daughtress-command-gd02-044",
  displayName: "Daughtress Command",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-044",
  printings: [
    {
      id: "GD02-044",
      collectorNumber: "GD02-044",
      cardNumber: "GD02-044",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-044.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-044.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-044",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-044.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-044.webp?260424",
  legality: "legal",
  level: 2,
  cost: 2,
  ap: 3,
  hp: 1,
  effect:
    "【Destroyed】If you have another (New UNE) Unit in play, deploy 1 rested [Daughtress]((New UNE)･AP0･HP1) Unit token.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
      },
      directives: [
        {
          condition: {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            excludeSelf: true,
            hasTrait: "new une",
          },
          thenDirectives: [
            {
              action: {
                action: "deployToken",
                token: {
                  name: "Daughtress",
                  traits: ["new une"],
                  ap: 0,
                  hp: 1,
                  deployState: "rested",
                  printedCardNumber: "T-012",
                },
              },
            },
          ],
        },
      ],
      sourceText:
        "【Destroyed】If you have another (New UNE) Unit in play, deploy 1 rested [Daughtress]((New UNE)·AP0·HP1) Unit token.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
