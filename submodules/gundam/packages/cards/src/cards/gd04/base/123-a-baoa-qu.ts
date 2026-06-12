import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd04ABaoaQu123: BaseCard = {
  cardNumber: "GD04-123",
  name: "A Baoa Qu",
  type: "base",
  traits: ["zeon", "stronghold"],
  id: "GD04-123",
  externalId: "gundam:gd04-123",
  slug: "a-baoa-qu-gd04-123",
  displayName: "A Baoa Qu",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-123",
  printings: [
    {
      id: "GD04-123",
      collectorNumber: "GD04-123",
      cardNumber: "GD04-123",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-123.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-123.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-123",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-123.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-123.webp?260424",
  legality: "legal",
  level: 5,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\r\nWhile you have a rested (Zeon) Unit in play, this Base can't receive battle damage from enemy Units that are Lv.4 or lower.",
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
      type: "constant",
      activation: {
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: "zeon",
            state: "rested",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "preventDamage",
            target: {
              owner: "self",
            },
            unitFilter: {
              owner: "opponent",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "While you have a rested (Zeon) Unit in play, this Base can't receive battle damage from enemy Units that are Lv.4 or lower.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
