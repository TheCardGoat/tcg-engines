import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd04Industrial7130: BaseCard = {
  cardNumber: "GD04-130",
  name: "Industrial 7",
  type: "base",
  traits: ["civilian", "stronghold"],
  id: "GD04-130",
  externalId: "gundam:gd04-130",
  slug: "industrial-7-gd04-130",
  displayName: "Industrial 7",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-130",
  printings: [
    {
      id: "GD04-130",
      collectorNumber: "GD04-130",
      cardNumber: "GD04-130",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-130.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-130.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-130",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-130.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-130.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\r\n【Activate･Main】【Once per Turn】Exile 1 Command card from your trash：Choose 1 enemy Unit. It gets AP-1 during this turn.",
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
        exileFromTrash: {
          owner: "friendly",
          cardType: "command",
          zone: "trash",
          count: 1,
        },
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -1,
            duration: "thisTurn",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Activate·Main】【Once per Turn】Exile 1 Command card from your trash：Choose 1 enemy Unit. It gets AP-1 during this turn.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
