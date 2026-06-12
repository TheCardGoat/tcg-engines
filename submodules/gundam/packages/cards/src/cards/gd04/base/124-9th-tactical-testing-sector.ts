import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd049thTacticalTestingSector124: BaseCard = {
  cardNumber: "GD04-124",
  name: "9th Tactical Testing Sector",
  type: "base",
  traits: ["academy", "stronghold"],
  id: "GD04-124",
  externalId: "gundam:gd04-124",
  slug: "9th-tactical-testing-sector-gd04-124",
  displayName: "9th Tactical Testing Sector",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-124",
  printings: [
    {
      id: "GD04-124",
      collectorNumber: "GD04-124",
      cardNumber: "GD04-124",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-124.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-124.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-124",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-124.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-124.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\r\nWhen you place an EX Resource, choose 1 friendly (Academy) Unit. It gets AP+2 during this turn.",
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
        timing: ["onExResourcePlaced"],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "academy",
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "When you place an EX Resource, choose 1 friendly (Academy) Unit. It gets AP+2 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
