import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd02AspiringPilot120: CommandCard = {
  cardNumber: "GD02-120",
  name: "Aspiring Pilot",
  type: "command",
  color: "white",
  traits: ["aeug"],
  id: "GD02-120",
  externalId: "gundam:gd02-120",
  slug: "aspiring-pilot-gd02-120",
  displayName: "Aspiring Pilot",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-120",
  printings: [
    {
      id: "GD02-120",
      collectorNumber: "GD02-120",
      cardNumber: "GD02-120",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-120.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-120.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-120",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-120.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-120.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  pilotName: "Fa Yuiry",
  apBonus: 0,
  hpBonus: 1,
  effect:
    "【Action】Choose 1 of your (AEUG) Units/Bases. It recovers 2 HP.<br>【Pilot】[Fa Yuiry]<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["action"],
      },
      directives: [
        {
          action: {
            action: "recoverHP",
            amount: 2,
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "aeug",
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Action】Choose 1 of your (AEUG) Units/Bases. It recovers 2 HP. 【Pilot】[Fa Yuiry]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
