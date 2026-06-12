import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd04Trinity111: CommandCard = {
  cardNumber: "GD04-111",
  name: "Trinity",
  type: "command",
  color: "red",
  traits: ["cb", "trinity"],
  id: "GD04-111",
  externalId: "gundam:gd04-111",
  slug: "trinity-gd04-111",
  displayName: "Trinity",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-111",
  printings: [
    {
      id: "GD04-111",
      collectorNumber: "GD04-111",
      cardNumber: "GD04-111",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-111.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-111.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-111",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-111.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-111.webp?260424",
  legality: "legal",
  level: 4,
  cost: 1,
  pilotName: "Johann Trinity",
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Main】/【Action】Choose 1 to 3 of your (CB) Units. They get AP+2 during this turn.\n【Pilot】[Johann Trinity]",
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
                  value: "cb",
                },
              ],
              count: {
                min: 1,
                max: 3,
              },
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 to 3 of your (CB) Units. They get AP+2 during this turn. 【Pilot】[Johann Trinity]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
