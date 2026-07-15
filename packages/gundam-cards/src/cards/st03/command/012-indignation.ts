import type { CommandCardDefinition } from "@tcg/gundam-types";

export const Indignation: CommandCardDefinition = {
  cardNumber: "ST03-012",
  cardType: "COMMAND",
  color: "red",
  cost: 1,
  id: "st03-012",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST03-012.webp?26013001",
  level: 2,
  name: "Indignation",
  pilotProperties: {
    apModifier: 1,
    hpModifier: 0,
    name: "Angelo Sauper",
    traits: ["neo", "zeon"],
  },
  rarity: "common",
  setCode: "ST03",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  text: "【Main】/【Action】Choose 1 friendly Unit. It gets AP+2 during this turn.\n【Pilot】[Angelo Sauper]",
  timing: "MAIN",
};
