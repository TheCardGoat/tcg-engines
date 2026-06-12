import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd02Freeden127: BaseCard = {
  cardNumber: "GD02-127",
  name: "Freeden",
  type: "base",
  traits: ["vulture", "warship"],
  id: "GD02-127",
  externalId: "gundam:gd02-127",
  slug: "freeden-gd02-127",
  displayName: "Freeden",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-127",
  printings: [
    {
      id: "GD02-127",
      collectorNumber: "GD02-127",
      cardNumber: "GD02-127",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-127.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-127.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-127",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-127.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-127.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand.<br>\n【Destroyed】Place the top 2 cards of your deck into your trash.<br>",
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
      ],
      sourceText: "【Deploy】Add 1 of your Shields to your hand.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
      },
      directives: [
        {
          action: {
            action: "millDeck",
            count: 2,
            owner: "self",
          },
        },
      ],
      sourceText: "【Destroyed】Place the top 2 cards of your deck into your trash.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
