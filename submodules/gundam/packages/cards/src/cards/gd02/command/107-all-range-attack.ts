import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd02AllRangeAttack107: CommandCard = {
  cardNumber: "GD02-107",
  name: "All-Range Attack",
  type: "command",
  color: "red",
  traits: ["-"],
  id: "GD02-107",
  externalId: "gundam:gd02-107",
  slug: "all-range-attack-gd02-107",
  displayName: "All-Range Attack",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-107",
  printings: [
    {
      id: "GD02-107",
      collectorNumber: "GD02-107",
      cardNumber: "GD02-107",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-107.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-107.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-107_p1",
      collectorNumber: "GD02-107_p1",
      cardNumber: "GD02-107",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-107_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-107_p1.webp?260424",
      productName: "Dual Impact [GD02]",
    },
    {
      id: "GD02-107_p2",
      collectorNumber: "GD02-107_p2",
      cardNumber: "GD02-107",
      set: {
        code: "GD02",
        name: "Newtype Challenge 2025 Mission 3",
        packageId: "616901",
      },
      rarity: "rare",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-107_p2.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-107_p2.webp?260424",
      productName: "Newtype Challenge 2025 Mission 3",
    },
  ],
  selectedPrintingId: "GD02-107",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-107.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-107.webp?260424",
  legality: "legal",
  level: 4,
  cost: 2,
  effect:
    "【Burst】Choose 1 enemy Unit. Deal 1 damage to it.<br>【Main】Deal 1 damage to all enemy Units other than Link Units.<br>",
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
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
      sourceText: "【Burst】Choose 1 enemy Unit. Deal 1 damage to it.",
    },
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "dealDamageAll",
            amount: 1,
            target: {
              owner: "opponent",
              cardType: "unit",
              isLinkUnit: false,
            },
          },
        },
      ],
      sourceText: "【Main】Deal 1 damage to all enemy Units other than Link Units.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
