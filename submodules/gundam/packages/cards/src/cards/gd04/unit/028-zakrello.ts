import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04Zakrello028: UnitCard = {
  cardNumber: "GD04-028",
  name: "Zakrello",
  type: "unit",
  color: "green",
  traits: ["zeon"],
  id: "GD04-028",
  externalId: "gundam:gd04-028",
  slug: "zakrello-gd04-028",
  displayName: "Zakrello",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-028",
  printings: [
    {
      id: "GD04-028",
      collectorNumber: "GD04-028",
      cardNumber: "GD04-028",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-028.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-028.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-028",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-028.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-028.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  ap: 4,
  hp: 1,
  effect:
    "【Attack】Choose 1 active enemy Unit. It gains <Blocker> during this turn.\n\r\n(Rest this Unit to change the attack target to it.)",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["attack"],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Blocker",
            duration: "thisTurn",
            target: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Attack】Choose 1 active enemy Unit. It gains <Blocker> during this turn. (Rest this Unit to change the attack target to it.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
