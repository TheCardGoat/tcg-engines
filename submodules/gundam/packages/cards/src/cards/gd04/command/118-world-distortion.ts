import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd04WorldDistortion118: CommandCard = {
  cardNumber: "GD04-118",
  name: "World Distortion",
  type: "command",
  color: "white",
  traits: ["un"],
  id: "GD04-118",
  externalId: "gundam:gd04-118",
  slug: "world-distortion-gd04-118",
  displayName: "World Distortion",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-118",
  printings: [
    {
      id: "GD04-118",
      collectorNumber: "GD04-118",
      cardNumber: "GD04-118",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-118.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-118.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-118",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-118.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-118.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  pilotName: "Alejandro Corner",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Main】/【Action】If 2 or more friendly (UN) Units are in play, choose 1 enemy Unit with 5 or less HP. Return it to its owner's hand.\n【Pilot】[Alejandro Corner]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 2,
            hasTrait: "un",
          },
        ],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [{ attribute: "hp", comparison: "lte", value: 5 }],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】If 2 or more friendly (UN) Units are in play, choose 1 enemy Unit with 5 or less HP. Return it to its owner's hand. 【Pilot】[Alejandro Corner]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
