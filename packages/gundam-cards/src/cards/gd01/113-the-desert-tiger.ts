import type { CommandCardDefinition } from "@tcg/gundam-types";

export const TheDesertTiger: CommandCardDefinition = {
  id: "gd01-113",
  name: "The Desert Tiger",
  cardNumber: "GD01-113",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "uncommon",
  color: "red",
  level: 3,
  cost: 1,
  text: "【Main】/【Action】Choose 1 friendly (ZAFT) Unit. It gets AP+3 during this turn.\n【Pilot】[Andrew Waldfeld]",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-113.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  timing: "MAIN",
  pilotProperties: {
    name: "Andrew Waldfeld",
    traits: ["zaft", "coordinator"],
    apModifier: 1,
    hpModifier: 0,
  },
  abilities: [
    {
      description:
        "【Main】/【Action】Choose 1 friendly (ZAFT) Unit. It gets AP+3 during this turn. 【Pilot】[Andrew Waldfeld]",
      effect: {
        type: "MODIFY_STATS",
        attribute: "ap",
        modifier: 3,
        duration: "turn",
      },
    },
  ],
};
