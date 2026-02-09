import type { CommandCardDefinition } from "@tcg/gundam-types";

export const DeepDevotion: CommandCardDefinition = {
  id: "gd01-101",
  name: "Deep Devotion",
  cardNumber: "GD01-101",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "rare",
  color: "blue",
  level: 2,
  cost: 1,
  text: "【Main】/【Action】Choose 1 friendly Link Unit. It recovers 3 HP.\n【Pilot】[Lucrezia Noin]",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-101.webp?26013001",
  sourceTitle: "Mobile Suit Gundam Wing",
  timing: "MAIN",
  pilotProperties: {
    name: "Lucrezia Noin",
    traits: ["oz"],
    apModifier: 1,
    hpModifier: 0,
  },
};
