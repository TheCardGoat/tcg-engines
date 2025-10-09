import type { CommandCardDefinition } from "../../card-types";

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
  text: "【Main】Choose 1 of your Units. It gains &lt;Breach 3&gt; during this turn.<br />\r\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)\n【Pilot】[Trowa Barton]",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-012.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  timing: "MAIN",
  pilotProperties: {
    name: "Trowa Barton",
    traits: [
      "operation",
      "meteor",
    ],
    apModifier: 1,
    hpModifier: 1,
  },
  abilities: [
    {
      description: "【Main】Choose 1 of your Units. It gains <Breach 3> during this turn.<br /> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.) 【Pilot】[Trowa Barton]",
      effect: {
        type: "UNKNOWN",
        rawText: "【Main】Choose 1 of your Units. It gains <Breach 3> during this turn.<br /> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.) 【Pilot】[Trowa Barton]",
      },
    },
  ],
};
