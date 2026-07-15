import type { CommandCardDefinition } from "@tcg/gundam-types";

export const AssaultOnTorringtonBase: CommandCardDefinition = {
  cardNumber: "GD01-114",
  cardType: "COMMAND",
  color: "red",
  cost: 1,
  id: "gd01-114",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-114.webp?26013001",
  level: 1,
  name: "Assault on Torrington Base",
  pilotProperties: {
    apModifier: 1,
    hpModifier: 0,
    name: "Yonem Kirks",
    traits: ["zeon"],
  },
  rarity: "common",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  text: "【Action】Choose 2 friendly Units. They get AP+1 during this turn.\n【Pilot】[Yonem Kirks]",
  timing: "ACTION",
};
