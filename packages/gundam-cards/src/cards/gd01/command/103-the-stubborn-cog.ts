import type { CommandCardDefinition } from "@tcg/gundam-types";

export const TheStubbornCog: CommandCardDefinition = {
  cardNumber: "GD01-103",
  cardType: "COMMAND",
  color: "blue",
  cost: 1,
  id: "gd01-103",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-103.webp?26013001",
  level: 1,
  name: "The Stubborn Cog",
  pilotProperties: {
    apModifier: 0,
    hpModifier: 1,
    name: "Daguza Mackle",
    traits: ["earth", "federation"],
  },
  rarity: "common",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  text: "【Main】Choose 1 active friendly (Earth Federation) Unit and 1 active enemy Unit. Rest them.\n【Pilot】[Daguza Mackle]",
  timing: "MAIN",
};
