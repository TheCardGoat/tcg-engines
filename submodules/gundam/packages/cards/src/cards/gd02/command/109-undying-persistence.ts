import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd02UndyingPersistence109: CommandCard = {
  cardNumber: "GD02-109",
  name: "Undying Persistence",
  type: "command",
  color: "red",
  traits: ["clan", "newtype"],
  id: "GD02-109",
  externalId: "gundam:gd02-109",
  slug: "undying-persistence-gd02-109",
  displayName: "Undying Persistence",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-109",
  printings: [
    {
      id: "GD02-109",
      collectorNumber: "GD02-109",
      cardNumber: "GD02-109",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-109.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-109.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-109",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-109.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-109.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  pilotName: "Shiiko Sugai",
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Main】/【Action】Choose 1 enemy Unit. Deal 1 damage to it.<br>【Pilot】[Shiiko Sugai]<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
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
        "【Main】/【Action】Choose 1 enemy Unit. Deal 1 damage to it. 【Pilot】[Shiiko Sugai]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
