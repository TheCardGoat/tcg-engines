import type { CommandCardDefinition } from "@tcg/gundam-types";

export const IronfistedDiscipline: CommandCardDefinition = {
  id: "gd01-119",
  name: "Iron-Fisted Discipline",
  cardNumber: "GD01-119",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "rare",
  color: "white",
  level: 2,
  cost: 1,
  text: "【Main】/【Action】Choose 1 enemy Unit that is Lv.4 or lower. It gets AP-2 during this turn.\n【Pilot】[Chuatury Panlunch]",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-119.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  timing: "MAIN",
  pilotProperties: {
    name: "Chuatury Panlunch",
    traits: ["academy"],
    apModifier: 1,
    hpModifier: 0,
  },
  effects: [
    {
      id: "eff-bpo8e3oem",
      type: "CONSTANT",
      description: "/",
      restrictions: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "/",
      },
    },
    {
      id: "eff-iywxqpzkd",
      type: "CONSTANT",
      description:
        "Choose 1 enemy Unit that is Lv.4 or lower. It gets AP-2 during this turn. 【Pilot】[Chuatury Panlunch]",
      restrictions: [],
      conditions: [],
      action: {
        type: "MODIFY_STATS",
        attribute: "AP",
        value: -2,
        duration: "TURN",
        target: {
          controller: "OPPONENT",
          cardType: "UNIT",
          count: {
            min: 1,
            max: 1,
          },
          filters: [],
        },
      },
    },
  ],
};
