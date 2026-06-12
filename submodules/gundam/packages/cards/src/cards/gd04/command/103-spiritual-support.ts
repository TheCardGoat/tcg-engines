import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd04SpiritualSupport103: CommandCard = {
  cardNumber: "GD04-103",
  name: "Spiritual Support",
  type: "command",
  color: "blue",
  traits: [],
  id: "GD04-103",
  externalId: "gundam:gd04-103",
  slug: "spiritual-support-gd04-103",
  displayName: "Spiritual Support",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-103",
  printings: [
    {
      id: "GD04-103",
      collectorNumber: "GD04-103",
      cardNumber: "GD04-103",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-103.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-103.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-103",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-103.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-103.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  effect:
    "【Main】Choose 1 of your Units. It gains <Repair 2> during this turn.\n\r\n(At the end of your turn, this Unit recovers the specified number of HP.)",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Repair",
            keywordValue: 2,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Main】Choose 1 of your Units. It gains <Repair 2> during this turn. (At the end of your turn, this Unit recovers the specified number of HP.)",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
