import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd04ReliableBigBrother116: CommandCard = {
  cardNumber: "GD04-116",
  name: "Reliable Big Brother",
  type: "command",
  color: "purple",
  traits: ["zaft", "minerva squad", "coordinator"],
  id: "GD04-116",
  externalId: "gundam:gd04-116",
  slug: "reliable-big-brother-gd04-116",
  displayName: "Reliable Big Brother",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-116",
  printings: [
    {
      id: "GD04-116",
      collectorNumber: "GD04-116",
      cardNumber: "GD04-116",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-116.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-116.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-116",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-116.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-116.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  pilotName: "Heine Westenfluss",
  apBonus: 0,
  hpBonus: 2,
  effect:
    "【Main】Place the top 2 cards of your deck into your trash. If you do, choose 1 enemy Unit with 4 or less AP. Deal an amount of damage equal to the number of (Minerva Squad) cards placed with this effect to that enemy Unit.\n【Pilot】[Heine Westenfluss]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "millDeckThenDamageByTraitCount",
            count: 2,
            owner: "self",
            traits: "minerva squad",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              attributeFilters: [{ attribute: "ap", comparison: "lte", value: 4 }],
            },
          },
        },
      ],
      sourceText:
        "【Main】Place the top 2 cards of your deck into your trash. If you do, choose 1 enemy Unit with 4 or less AP. Deal an amount of damage equal to the number of (Minerva Squad) cards placed with this effect to that enemy Unit. 【Pilot】[Heine Westenfluss]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
