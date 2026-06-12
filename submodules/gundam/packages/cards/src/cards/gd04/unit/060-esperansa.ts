import type { CardEffect, UnitCard } from "@tcg/gundam-types";

export const gd04Esperansa060: UnitCard = {
  cardNumber: "GD04-060",
  name: "Esperansa",
  type: "unit",
  color: "purple",
  traits: ["vulture"],
  id: "GD04-060",
  externalId: "gundam:gd04-060",
  slug: "esperansa-gd04-060",
  displayName: "Esperansa",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-060",
  printings: [
    {
      id: "GD04-060",
      collectorNumber: "GD04-060",
      cardNumber: "GD04-060",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-060.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-060.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-060",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-060.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-060.webp?260424",
  legality: "legal",
  level: 3,
  cost: 2,
  ap: 1,
  hp: 4,
  linkCondition: "[Ennil El]",
  effect: "【Deploy】If you deploy this Unit from your trash, draw 1.",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["deploy"],
        conditions: [{ type: "deployedFromZone", zone: "trash" }],
      },
      directives: [
        {
          action: {
            action: "draw",
            count: 1,
          },
        },
      ],
      sourceText: "【Deploy】If you deploy this Unit from your trash, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
