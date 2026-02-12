import type { CommandCardDefinition } from "@tcg/gundam-types";

export const SimultaneousFire: CommandCardDefinition = {
  cardNumber: "ST02-012",
  cardType: "COMMAND",
  color: "green",
  cost: 1,
  id: "st02-012",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-012.webp?26013001",
  level: 4,
  name: "Simultaneous Fire",
  pilotProperties: {
    apModifier: 1,
    hpModifier: 1,
    name: "Trowa Barton",
    traits: ["operation", "meteor"],
  },
  rarity: "common",
  setCode: "ST02",
  sourceTitle: "Mobile Suit Gundam Wing",
  text: "【Main】Choose 1 of your Units. It gains <Breach 3> during this turn.\n\r\n(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)\n【Pilot】[Trowa Barton]",
  timing: "MAIN",
};
