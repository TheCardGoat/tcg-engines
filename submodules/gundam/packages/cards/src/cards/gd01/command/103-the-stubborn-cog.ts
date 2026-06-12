import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd01TheStubbornCog103: CommandCard = {
  cardNumber: "GD01-103",
  name: "The Stubborn Cog",
  type: "command",
  color: "blue",
  traits: ["earth federation"],
  id: "GD01-103",
  externalId: "gundam:gd01-103",
  slug: "the-stubborn-cog-gd01-103",
  displayName: "The Stubborn Cog",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-103",
  printings: [
    {
      id: "GD01-103",
      collectorNumber: "GD01-103",
      cardNumber: "GD01-103",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-103.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-103.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-103",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-103.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-103.webp?260424",
  legality: "legal",
  level: 1,
  cost: 1,
  pilotName: "Daguza Mackle",
  apBonus: 0,
  hpBonus: 1,
  effect:
    "【Main】Choose 1 active friendly (Earth Federation) Unit and 1 active enemy Unit. Rest them.<br>【Pilot】[Daguza Mackle]<br>",
  effects: [
    {
      type: "command",
      activation: {
        timing: ["main"],
      },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "friendly",
              cardType: "unit",
              state: "active",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "earth federation",
                },
              ],
              count: 1,
            },
          },
        },
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Main】Choose 1 active friendly (Earth Federation) Unit and 1 active enemy Unit. Rest them. 【Pilot】[Daguza Mackle]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};
