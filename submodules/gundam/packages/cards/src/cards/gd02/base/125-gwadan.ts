import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd02Gwadan125: BaseCard = {
  cardNumber: "GD02-125",
  name: "Gwadan",
  type: "base",
  traits: ["neo zeon", "warship"],
  id: "GD02-125",
  externalId: "gundam:gd02-125",
  slug: "gwadan-gd02-125",
  displayName: "Gwadan",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-125",
  printings: [
    {
      id: "GD02-125",
      collectorNumber: "GD02-125",
      cardNumber: "GD02-125",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-125.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-125.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-125",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-125.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-125.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  hp: 5,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, you may discard 1 red card. If you do, draw 1.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "deploySelf",
          },
        },
      ],
      sourceText: "【Burst】Deploy this card.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
      },
      directives: [
        {
          action: {
            action: "addShieldToHand",
            count: 1,
          },
        },
        {
          condition: { type: "isTurn", whose: "friendly" },
          thenDirectives: [
            {
              action: {
                action: "discard",
                count: 1,
                filter: {
                  owner: "friendly",
                  zone: "hand",
                  count: 1,
                  attributeFilters: [{ attribute: "color", comparison: "eq", value: "red" }],
                },
              },
              optional: true,
            },
            {
              action: {
                action: "draw",
                count: 1,
              },
              dependsOnPrevious: true,
            },
          ],
        },
      ],
      sourceText:
        "【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, you may discard 1 red card. If you do, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
