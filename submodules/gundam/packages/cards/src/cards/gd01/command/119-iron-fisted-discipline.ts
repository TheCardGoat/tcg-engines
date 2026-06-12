import type { CardEffect, CommandCard } from "@tcg/gundam-types";

export const gd01IronFistedDiscipline119: CommandCard = {
  cardNumber: "GD01-119",
  name: "Iron-Fisted Discipline",
  type: "command",
  color: "white",
  traits: ["academy"],
  id: "GD01-119",
  externalId: "gundam:gd01-119",
  slug: "iron-fisted-discipline-gd01-119",
  displayName: "Iron-Fisted Discipline",
  set: { code: "GD01", name: "Newtype Rising [GD01]", packageId: "616101" },
  printNumber: "GD01-119",
  printings: [
    {
      id: "GD01-119",
      collectorNumber: "GD01-119",
      cardNumber: "GD01-119",
      set: {
        code: "GD01",
        name: "Newtype Rising [GD01]",
        packageId: "616101",
      },
      rarity: "rare",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-119.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-119.webp?260424",
      productName: "Newtype Rising [GD01]",
    },
  ],
  selectedPrintingId: "GD01-119",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/gd01/GD01-119.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-119.webp?260424",
  legality: "legal",
  level: 2,
  cost: 1,
  pilotName: "Chuatury Panlunch",
  apBonus: 1,
  hpBonus: 0,
  effect:
    "【Main】/【Action】Choose 1 enemy Unit that is Lv.4 or lower. It gets AP-2 during this turn.<br>【Pilot】[Chuatury Panlunch]<br>",
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
            amount: -2,
            duration: "thisTurn",
            target: {
              owner: "opponent",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "level",
                  comparison: "lte",
                  value: 4,
                },
              ],
              count: 1,
            },
          },
        },
      ],
      sourceText:
        "【Main】/【Action】Choose 1 enemy Unit that is Lv.4 or lower. It gets AP-2 during this turn. 【Pilot】[Chuatury Panlunch]",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "rare",
};
