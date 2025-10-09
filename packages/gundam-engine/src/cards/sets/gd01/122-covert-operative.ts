import type { CommandCardDefinition } from "../../card-types";

export const CovertOperative: CommandCardDefinition = {
  id: "gd01-122",
  name: "Covert Operative",
  cardNumber: "GD01-122",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "common",
  color: "white",
  level: 3,
  cost: 1,
  text: "【Main】Choose 1 enemy Unit with 2 or less HP. Return it to its owner&#039;s hand. If you have a Link Unit in play, choose 1 enemy Unit with 4 or less HP instead.
【Pilot】[Shaddiq Zenelli]
",
  imageUrl: "../images/cards/card/GD01-122.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  timing: "MAIN",
  pilotProperties: {
    name: "Shaddiq Zenelli",
    traits: [
      "academy",
    ],
    apModifier: 1,
    hpModifier: 0,
  },
  abilities: [
    {
      description: "【Main】Choose 1 enemy Unit with 2 or less HP. Return it to its owner&#039;s hand. If you have a Link Unit in play, choose 1 enemy Unit with 4 or less HP instead. 【Pilot】[Shaddiq Zenelli]",
      effect: {
        type: "UNKNOWN",
        rawText: "【Main】Choose 1 enemy Unit with 2 or less HP. Return it to its owner&#039;s hand. If you have a Link Unit in play, choose 1 enemy Unit with 4 or less HP instead. 【Pilot】[Shaddiq Zenelli]",
      },
    },
  ],
};
