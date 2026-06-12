import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd04Jaburo122: BaseCard = {
  cardNumber: "GD04-122",
  name: "Jaburo",
  type: "base",
  traits: ["earth federation", "stronghold"],
  id: "GD04-122",
  externalId: "gundam:gd04-122",
  slug: "jaburo-gd04-122",
  displayName: "Jaburo",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-122",
  printings: [
    {
      id: "GD04-122",
      collectorNumber: "GD04-122",
      cardNumber: "GD04-122",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-122.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-122.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-122",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-122.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-122.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\r\n【Activate･Main】【Once per Turn】Rest 1 of your (Earth Federation) Units：Choose 1 enemy Unit that is Lv.3 or lower. Rest it.",
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
      type: "activated",
      activation: {
        timing: ["activate:main"],
        restrictions: [
          {
            type: "oncePerTurn",
          },
        ],
      },
      cost: {
        restTarget: {
          owner: "friendly",
          cardType: "unit",
          state: "active",
          count: 1,
          attributeFilters: [
            {
              attribute: "trait",
              comparison: "includes",
              value: "earth federation",
            },
          ],
        },
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Activate·Main】【Once per Turn】Rest 1 of your (Earth Federation) Units：Choose 1 enemy Unit that is Lv.3 or lower. Rest it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
