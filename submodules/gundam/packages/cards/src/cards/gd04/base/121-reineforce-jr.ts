import type { CardEffect, BaseCard } from "@tcg/gundam-types";

export const gd04ReineforceJr121: BaseCard = {
  cardNumber: "GD04-121",
  name: "Reineforce Jr.",
  type: "base",
  traits: ["league militaire", "warship"],
  id: "GD04-121",
  externalId: "gundam:gd04-121",
  slug: "reineforce-jr-gd04-121",
  displayName: "Reineforce Jr.",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-121",
  printings: [
    {
      id: "GD04-121",
      collectorNumber: "GD04-121",
      cardNumber: "GD04-121",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-121.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-121.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-121",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-121.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-121.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  hp: 5,
  effect:
    "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, during your turn, if a friendly (League Militaire) Unit is in play, deploy 1 [Parts]((League Militaire)･AP1･HP1･This Unit can't choose the enemy player as its attack target) Unit token.",
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
                hasTrait: "league militaire",
              },
            ],
          },
          thenDirectives: [
            {
              action: {
                action: "deployToken",
                token: {
                  name: "Parts",
                  traits: ["league militaire"],
                  ap: 1,
                  hp: 1,
                  cantTargetPlayer: true,
                  deployState: "active",
                },
              },
            },
          ],
        },
      ],
      sourceText:
        "【Deploy】Add 1 of your Shields to your hand. Then, during your turn, if a friendly (League Militaire) Unit is in play, deploy 1 [Parts]((League Militaire)·AP1·HP1·This Unit can't choose the enemy player as its attack target) Unit token.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
