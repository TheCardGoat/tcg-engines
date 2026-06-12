import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd04Reformationist114: CommandCard = {
  cardNumber: "GD04-114",
  name: "Reformationist",
  type: "command",
  color: "purple",
  traits: [],
  id: "GD04-114",
  externalId: "gundam:gd04-114",
  slug: "reformationist-gd04-114",
  displayName: "Reformationist",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-114",
  printings: [
    {
      id: "GD04-114",
      collectorNumber: "GD04-114",
      cardNumber: "GD04-114",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-114.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-114.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
    {
      id: "GD04-114_p1",
      collectorNumber: "GD04-114_p1",
      cardNumber: "GD04-114",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "parallel",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-114_p1.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-114_p1.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-114",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-114.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-114.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  effect:
    '【Burst】Choose 1 Unit card with "Trans-Am" in its card name from your trash. Add it to your hand.\n【Main】/【Action】Choose 1 of your Units and 1 enemy Unit. Deal 1 damage to them.',
  effects: [
    {
      type: "triggered",
      activation: {
        timing: ["burst"],
      },
      directives: [
        {
          action: {
            action: "addFromTrash",
            target: {
              owner: "friendly",
              cardType: "unit",
              zone: "trash",
              count: 1,
              attributeFilters: [
                {
                  attribute: "name",
                  comparison: "includes",
                  value: "Trans-Am",
                },
              ],
            },
          },
        },
      ],
      sourceText:
        '【Burst】Choose 1 Unit card with "Trans-Am" in its card name from your trash. Add it to your hand.',
    },
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
              owner: "friendly",
              cardType: "unit",
              count: 1,
            },
          },
        },
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
        "【Main】/【Action】Choose 1 of your Units and 1 enemy Unit. Deal 1 damage to them.",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
