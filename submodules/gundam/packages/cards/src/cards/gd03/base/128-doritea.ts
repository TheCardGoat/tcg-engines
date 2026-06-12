import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd03Doritea128: BaseCard = {
  cardNumber: "GD03-128",
  name: "Doritea",
  type: "base",
  traits: ["new une", "warship"],
  id: "GD03-128",
  externalId: "gundam:gd03-128",
  slug: "doritea-gd03-128",
  displayName: "Doritea",
  set: { code: "GD03", name: "Steel Requiem[GD03]", packageId: "616103" },
  printNumber: "GD03-128",
  printings: [
    {
      id: "GD03-128",
      collectorNumber: "GD03-128",
      cardNumber: "GD03-128",
      set: {
        code: "GD03",
        name: "Steel Requiem[GD03]",
        packageId: "616103",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-128.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-128.webp?260424",
      productName: "Steel Requiem[GD03]",
    },
  ],
  selectedPrintingId: "GD03-128",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd03/GD03-128.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD03-128.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\r\n【Once per Turn】During your opponent's turn, when one of your Units is rested by one of your opponent's effects, choose 1 enemy Unit. Deal 1 damage to it.",
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
        timing: ["onRestedByEnemyEffect"],
        restrictions: [{ type: "oncePerTurn" }],
        conditions: [
          { type: "isTurn", whose: "opponent" },
          { type: "eventPlayerIsOpponent" },
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
            action: "dealDamage",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Once per Turn】During your opponent's turn, when one of your Units is rested by one of your opponent's effects, choose 1 enemy Unit. Deal 1 damage to it.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
