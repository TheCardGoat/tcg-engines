import type { CommandCardDefinition } from "@tcg/gundam-types";

export const AssaultOnTorringtonBase: CommandCardDefinition = {
  id: "gd01-114",
  name: "Assault on Torrington Base",
  cardNumber: "GD01-114",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "common",
  color: "red",
  level: 1,
  cost: 1,
  text: "【Action】Choose 2 friendly Units. They get AP+1 during this turn.\n【Pilot】[Yonem Kirks]",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-114.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  timing: "ACTION",
  pilotProperties: {
    name: "Yonem Kirks",
    traits: ["zeon"],
    apModifier: 1,
    hpModifier: 0,
  },
  abilities: [
    {
      description:
        "【Action】Choose 2 friendly Units. They get AP+1 during this turn. 【Pilot】[Yonem Kirks]",
      effect: {
        type: "MODIFY_STATS",
        attribute: "ap",
        modifier: 1,
        duration: "turn",
      },
    },
  ],
};
