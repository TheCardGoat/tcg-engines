import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd04GracefulDemeanor117: CommandCard = {
  cardNumber: "GD04-117",
  name: "Graceful Demeanor",
  type: "command",
  color: "white",
  traits: [],
  id: "GD04-117",
  externalId: "gundam:gd04-117",
  slug: "graceful-demeanor-gd04-117",
  displayName: "Graceful Demeanor",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-117",
  printings: [
    {
      id: "GD04-117",
      collectorNumber: "GD04-117",
      cardNumber: "GD04-117",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-117.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-117.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-117_p1",
      collectorNumber: "GD04-117_p1",
      cardNumber: "GD04-117",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-117_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-117_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-117",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-117.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-117.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  effect:
    "【Burst】Activate this card's 【Action】.\n【Action】Choose 1 to 2 enemy Units that are Lv.3 or lower. Return them to their owners' hands.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "activateTiming",
            timing: "action",
          },
        },
      ],
      sourceText: "【Burst】Activate this card's 【Action】.",
    },
    {
      type: "command",
      activation: {
        timing: ["action"],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 3 }],
              count: { min: 1, max: 2 },
            },
          },
        },
      ],
      sourceText:
        "【Action】Choose 1 to 2 enemy Units that are Lv.3 or lower. Return them to their owners' hands.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
