import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd04ShrikeTeamSBulwark104: CommandCard = {
  cardNumber: "GD04-104",
  name: "Shrike Team's Bulwark",
  type: "command",
  color: "blue",
  traits: ["league militaire", "shrike team"],
  id: "GD04-104",
  externalId: "gundam:gd04-104",
  slug: "shrike-team-s-bulwark-gd04-104",
  displayName: "Shrike Team's Bulwark",
  set: { code: "GD04", name: "Phantom Aria [GD04]", packageId: "616104" },
  printNumber: "GD04-104",
  printings: [
    {
      id: "GD04-104",
      collectorNumber: "GD04-104",
      cardNumber: "GD04-104",
      set: {
        code: "GD04",
        name: "Phantom Aria [GD04]",
        packageId: "616104",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-104.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-104.webp?260424",
      productName: "Phantom Aria [GD04]",
    },
  ],
  selectedPrintingId: "GD04-104",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd04/GD04-104.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD04-104.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  pilotName: "Junko Jenko",
  apBonus: 1,
  hpBonus: 1,
  effect:
    "【Main】/【Action】Choose 1 to 2 enemy Units that are Lv.2 or lower. Rest them.\n【Pilot】[Junko Jenko]",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main", "action"],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 2,
                },
              ],
              count: {
                min: 1,
                max: 2,
              },
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 to 2 enemy Units that are Lv.2 or lower. Rest them. 【Pilot】[Junko Jenko]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
