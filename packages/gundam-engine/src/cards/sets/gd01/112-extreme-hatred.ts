import type { CommandCardDefinition } from "../../card-types";

export const ExtremeHatred: CommandCardDefinition = {
  id: "gd01-112",
  name: "Extreme Hatred",
  cardNumber: "GD01-112",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "rare",
  color: "red",
  level: 6,
  cost: 1,
  text: "【Main】Choose 2 of your active Units. Rest them. If you do, choose 1 enemy Unit. Deal 3 damage to it.
【Pilot】[Loni Garvey]
",
  imageUrl: "../images/cards/card/GD01-112.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  timing: "MAIN",
  pilotProperties: {
    name: "Loni Garvey",
    traits: [
      "zeon",
      "newtype",
    ],
    apModifier: 1,
    hpModifier: 0,
  },
  abilities: [
    {
      description: "【Main】Choose 2 of your active Units. Rest them. If you do, choose 1 enemy Unit. Deal 3 damage to it. 【Pilot】[Loni Garvey]",
      effect: {
        type: "DAMAGE",
        amount: 3,
        target: {
          type: "unknown",
          rawText: "it",
        },
      },
    },
  ],
};
