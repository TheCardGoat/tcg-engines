import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd04DestinedBattle107: CommandCard = {
  cardNumber: "GD04-107",
  name: "Destined Battle",
  type: "command",
  color: "green",
  traits: [],
  id: "GD04-107",
  externalId: "gundam:gd04-107",
  slug: "destined-battle-gd04-107",
  displayName: "Destined Battle",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-107",
  printings: [
    {
      id: "GD04-107",
      collectorNumber: "GD04-107",
      cardNumber: "GD04-107",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-107.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-107.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-107",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-107.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-107.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  effect:
    "【Burst】Add this card to your hand.\n【Action】Choose 1 of your rested Units. During this turn, all enemy Units must choose that Unit as their attack target when attacking.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "addSelfToHand",
          },
        },
      ],
      sourceText: "【Burst】Add this card to your hand.",
    },
    {
      type: "command",
      activation: {
        timing: ["action"],
      },
      directives: [
        {
          action: {
            action: "forceAttackTarget",
            unit: {
              owner: "opponent",
              cardType: "unit",
              count: "all",
            },
            attackTarget: {
              owner: "friendly",
              cardType: "unit",
              state: "rested",
              count: 1,
            },
            duration: "thisTurn",
          },
        },
      ],
      sourceText:
        "【Action】Choose 1 of your rested Units. During this turn, all enemy Units must choose that Unit as their attack target when attacking.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
