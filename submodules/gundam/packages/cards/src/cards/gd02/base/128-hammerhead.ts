import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd02Hammerhead128: BaseCard = {
  cardNumber: "GD02-128",
  name: "Hammerhead",
  type: "base",
  traits: ["teiwaz", "warship"],
  id: "GD02-128",
  externalId: "gundam:gd02-128",
  slug: "hammerhead-gd02-128",
  displayName: "Hammerhead",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-128",
  printings: [
    {
      id: "GD02-128",
      collectorNumber: "GD02-128",
      cardNumber: "GD02-128",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-128.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-128.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-128",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-128.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-128.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  hp: 5,
  effect:
    "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn and a friendly (Teiwaz) Link Unit is in play, choose 1 enemy Unit with 2 or less AP. Destroy it.<br>",
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
          condition: {
            type: "and",
            conditions: [
              { type: "isTurn", whose: "friendly" },
              {
                type: "unitCount",
                owner: "friendly",
                comparison: "gte",
                count: 1,
                isLinkUnit: true,
                hasTrait: "teiwaz",
              },
            ],
          },
          thenDirectives: [
            {
              action: {
                action: "destroy",
                target: {
                  owner: "opponent",
                  cardType: "unit",
                  count: { min: 0, max: 1 },
                  attributeFilters: [{ attribute: "ap", comparison: "lte", value: 2 }],
                },
              },
            },
          ],
        },
      ],
      sourceText:
        "【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn and a friendly (Teiwaz) Link Unit is in play, choose 1 enemy Unit with 2 or less AP. Destroy it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
