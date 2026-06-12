import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd04TrinityWarship125: BaseCard = {
  cardNumber: "GD04-125",
  name: "Trinity Warship",
  type: "base",
  traits: ["cb", "warship"],
  id: "GD04-125",
  externalId: "gundam:gd04-125",
  slug: "trinity-warship-gd04-125",
  displayName: "Trinity Warship",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-125",
  printings: [
    {
      id: "GD04-125",
      collectorNumber: "GD04-125",
      cardNumber: "GD04-125",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-125.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-125.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-125",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-125.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-125.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\r\n【Activate･Main】【Once per Turn】①, rest 1 friendly (CB) Unit：Choose 1 enemy Unit that is Lv.5 or lower. Deal 1 damage to it.",
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
        payResources: 1,
        restTarget: {
          owner: "friendly",
          cardType: "unit",
          state: "active",
          count: 1,
          attributeFilters: [
            {
              attribute: "trait",
              comparison: "includes",
              value: "cb",
            },
          ],
        },
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        },
      ],
      sourceText:
        "【Activate·Main】【Once per Turn】①, rest 1 friendly (CB) Unit：Choose 1 enemy Unit that is Lv.5 or lower. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
