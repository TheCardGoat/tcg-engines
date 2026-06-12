import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd02FamilialDevotion115: CommandCard = {
  cardNumber: "GD02-115",
  name: "Familial Devotion",
  type: "command",
  color: "purple",
  traits: ["vulture"],
  id: "GD02-115",
  externalId: "gundam:gd02-115",
  slug: "familial-devotion-gd02-115",
  displayName: "Familial Devotion",
  set: { code: "GD02", name: "Dual Impact [GD02]", packageId: "616102" },
  printNumber: "GD02-115",
  printings: [
    {
      id: "GD02-115",
      collectorNumber: "GD02-115",
      cardNumber: "GD02-115",
      set: {
        code: "GD02",
        name: "Dual Impact [GD02]",
        packageId: "616102",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-115.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-115.webp?260424",
      productName: "Dual Impact [GD02]",
    },
  ],
  selectedPrintingId: "GD02-115",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd02/GD02-115.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD02-115.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  pilotName: "Witz Sou",
  apBonus: 0,
  hpBonus: 1,
  effect:
    "【Main】/【Action】Choose 1 friendly  (Vulture) Unit. It gets AP+2 during this turn.<br>【Pilot】[Witz Sou]<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "vulture",
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 friendly  (Vulture) Unit. It gets AP+2 during this turn. 【Pilot】[Witz Sou]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
