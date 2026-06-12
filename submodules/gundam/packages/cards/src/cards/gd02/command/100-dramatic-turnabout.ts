import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd02DramaticTurnabout100: CommandCard = {
  cardNumber: "GD02-100",
  name: "Dramatic Turnabout",
  type: "command",
  color: "blue",
  traits: ["-"],
  id: "GD02-100",
  externalId: "gundam:gd02-100",
  slug: "dramatic-turnabout-gd02-100",
  displayName: "Dramatic Turnabout",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-100",
  printings: [
    {
      id: "GD02-100",
      collectorNumber: "GD02-100",
      cardNumber: "GD02-100",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-100.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-100.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-100_p1",
      collectorNumber: "GD02-100_p1",
      cardNumber: "GD02-100",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-100_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-100_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-100",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-100.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-100.webp?260424",
  legality: "legal",
  level: 5,
  cost: 2,
  effect:
    "【Burst】Draw 1.<br>【Main】Choose 1 friendly damaged Unit. It recovers 2 HP. Then, draw 1.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "draw",
            count: 1,
          },
        },
      ],
      sourceText: "【Burst】Draw 1.",
    },
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "recoverHP",
            amount: 2,
            target: {
              owner: "friendly",
              cardType: "unit",
              state: "damaged",
              count: 1,
            },
          },
        },
        {
          action: {
            action: "draw",
            count: 1,
          },
        },
      ],
      sourceText: "【Main】Choose 1 friendly damaged Unit. It recovers 2 HP. Then, draw 1.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
