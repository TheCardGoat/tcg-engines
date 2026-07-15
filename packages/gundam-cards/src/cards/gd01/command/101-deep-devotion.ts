import type { CommandCardDefinition } from "@tcg/gundam-types";

export const DeepDevotion: CommandCardDefinition = {
  cardNumber: "GD01-101",
  cardType: "COMMAND",
  color: "blue",
  cost: 1,
  id: "gd01-101",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-101.webp?26013001",
  level: 2,
  name: "Deep Devotion",
  pilotProperties: {
    apModifier: 1,
    hpModifier: 0,
    name: "Lucrezia Noin",
    traits: ["oz"],
  },
  rarity: "rare",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam Wing",
  text: "【Main】/【Action】Choose 1 friendly Link Unit. It recovers 3 HP.\n【Pilot】[Lucrezia Noin]",
  timing: "MAIN",
};
