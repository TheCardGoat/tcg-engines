import type { CommandCardDefinition } from "@tcg/gundam-types";

export const TheDesertTiger: CommandCardDefinition = {
  cardNumber: "GD01-113",
  cardType: "COMMAND",
  color: "red",
  cost: 1,
  id: "gd01-113",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-113.webp?26013001",
  level: 3,
  name: "The Desert Tiger",
  pilotProperties: {
    apModifier: 1,
    hpModifier: 0,
    name: "Andrew Waldfeld",
    traits: ["zaft", "coordinator"],
  },
  rarity: "uncommon",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam SEED",
  text: "【Main】/【Action】Choose 1 friendly (ZAFT) Unit. It gets AP+3 during this turn.\n【Pilot】[Andrew Waldfeld]",
  timing: "MAIN",
};
