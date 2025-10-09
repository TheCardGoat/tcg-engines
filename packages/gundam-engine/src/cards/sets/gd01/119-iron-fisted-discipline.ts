import type { CommandCardDefinition } from "../../card-types";

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
  abilities: [
    {
      description:
        "【Main】/【Action】Choose 1 enemy Unit that is Lv.4 or lower. It gets AP-2 during this turn. 【Pilot】[Chuatury Panlunch]",
      effect: {
        type: "MODIFY_STATS",
        attribute: "ap",
        modifier: -2,
        duration: "turn",
      },
    },
  ],
};
