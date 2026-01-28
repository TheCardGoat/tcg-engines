import type { CommandCardDefinition } from "@tcg/gundam-types";

export const SimultaneousFire: CommandCardDefinition = {
  id: "st02-012",
  name: "Simultaneous Fire",
  cardNumber: "ST02-012",
  setCode: "ST02",
  cardType: "COMMAND",
  rarity: "common",
  color: "green",
  level: 4,
  cost: 1,
  text: "【Main】Choose 1 of your Units. It gains <Breach 3> during this turn.\n\r\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)\n【Pilot】[Trowa Barton]",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST02-012.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  timing: "MAIN",
  pilotProperties: {
    name: "Trowa Barton",
    traits: ["operation", "meteor"],
    apModifier: 1,
    hpModifier: 1,
  },
  effects: [
    {
      id: "eff-133hb45pz",
      type: "CONSTANT",
      description:
        "Choose 1 of your Units. It gains during this turn. (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.) 【Pilot】[Trowa Barton]",
      restrictions: [],
      conditions: [],
      action: {
        type: "DAMAGE",
        value: 0,
        target: {
          controller: "SELF",
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
  keywords: [
    {
      keyword: "Breach",
      value: 3,
    },
  ],
};
