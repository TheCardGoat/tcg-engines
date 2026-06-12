import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd01TheDesertTiger113: CommandCard = {
  cardNumber: "GD01-113",
  name: "The Desert Tiger",
  type: "command",
  color: "red",
  traits: ["zaft", "coordinator"],
  id: "GD01-113",
  externalId: "gundam:gd01-113",
  slug: "the-desert-tiger-gd01-113",
  displayName: "The Desert Tiger",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-113",
  printings: [
    {
      id: "GD01-113",
      collectorNumber: "GD01-113",
      cardNumber: "GD01-113",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "uncommon",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-113.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-113.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-113",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-113.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-113.webp?260424",
  legality: "legal",
  level: 3,
  cost: 1,
  pilotName: "Andrew Waldfeld",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Main】/【Action】Choose 1 friendly (ZAFT) Unit. It gets AP+3 during this turn.<br>【Pilot】[Andrew Waldfeld]<br>",
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
            amount: 3,
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "zaft",
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 friendly (ZAFT) Unit. It gets AP+3 during this turn. 【Pilot】[Andrew Waldfeld]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "uncommon",
};
