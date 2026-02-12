import type { CommandCardDefinition } from "@tcg/gundam-types";

export const IronfistedDiscipline: CommandCardDefinition = {
  cardNumber: "GD01-119",
  cardType: "COMMAND",
  color: "white",
  cost: 1,
  id: "gd01-119",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-119.webp?26013001",
  level: 2,
  name: "Iron-Fisted Discipline",
  pilotProperties: {
    apModifier: 1,
    hpModifier: 0,
    name: "Chuatury Panlunch",
    traits: ["academy"],
  },
  rarity: "rare",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  text: "【Main】/【Action】Choose 1 enemy Unit that is Lv.4 or lower. It gets AP-2 during this turn.\n【Pilot】[Chuatury Panlunch]",
  timing: "MAIN",
};
