import type { CommandCardDefinition } from "@tcg/gundam-types";

export const ExtremeHatred: CommandCardDefinition = {
  cardNumber: "GD01-112",
  cardType: "COMMAND",
  color: "red",
  cost: 1,
  id: "gd01-112",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-112.webp?26013001",
  level: 6,
  name: "Extreme Hatred",
  pilotProperties: {
    apModifier: 1,
    hpModifier: 0,
    name: "Loni Garvey",
    traits: ["zeon", "newtype"],
  },
  rarity: "rare",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  text: "【Main】Choose 2 of your active Units. Rest them. If you do, choose 1 enemy Unit. Deal 3 damage to it.\n【Pilot】[Loni Garvey]",
  timing: "MAIN",
};
