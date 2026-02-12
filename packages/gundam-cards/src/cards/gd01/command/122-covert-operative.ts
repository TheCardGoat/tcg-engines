import type { CommandCardDefinition } from "@tcg/gundam-types";

export const CovertOperative: CommandCardDefinition = {
  cardNumber: "GD01-122",
  cardType: "COMMAND",
  color: "white",
  cost: 1,
  id: "gd01-122",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-122.webp?26013001",
  level: 3,
  name: "Covert Operative",
  pilotProperties: {
    apModifier: 1,
    hpModifier: 0,
    name: "Shaddiq Zenelli",
    traits: ["academy"],
  },
  rarity: "common",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  text: "【Main】Choose 1 enemy Unit with 2 or less HP. Return it to its owner&#039;s hand. If you have a Link Unit in play, choose 1 enemy Unit with 4 or less HP instead.\n【Pilot】[Shaddiq Zenelli]",
  timing: "MAIN",
};
