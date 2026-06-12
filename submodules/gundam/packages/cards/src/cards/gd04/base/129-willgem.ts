import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd04Willgem129: BaseCard = {
  cardNumber: "GD04-129",
  name: "Willgem",
  type: "base",
  traits: ["militia", "warship"],
  id: "GD04-129",
  externalId: "gundam:gd04-129",
  slug: "willgem-gd04-129",
  displayName: "Willgem",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-129",
  printings: [
    {
      id: "GD04-129",
      collectorNumber: "GD04-129",
      cardNumber: "GD04-129",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-129.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-129.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-129",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-129.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-129.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  hp: 7,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, deal 3 damage to this Base.\n\r\n【Once per Turn】During your turn, when you pay ① or more for a friendly Unit's effect, this Base recovers 2 HP.",
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
          action: {
            action: "dealDamage",
            amount: 3,
            target: {
              owner: "self",
              cardType: "base",
            },
          },
        },
      ],
      sourceText: "【Deploy】Add 1 of your Shields to your hand. Then, deal 3 damage to this Base.",
    },
    {
      type: "triggered",
      activation: {
        timing: ["onUnitEffectCostPaid"],
        restrictions: [{ type: "oncePerTurn" }],
        conditions: [
          { type: "isTurn", whose: "friendly" },
          { type: "eventPlayerIsSelf" },
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
            },
          },
        ],
      },
      directives: [
        {
          action: {
            action: "recoverHP",
            amount: 2,
            target: {
              owner: "self",
              cardType: "base",
            },
          },
        },
      ],
      sourceText:
        "【Once per Turn】During your turn, when you pay ① or more for a friendly Unit's effect, this Base recovers 2 HP.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
