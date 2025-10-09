import type { CommandCardDefinition } from "../../card-types";

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
  text: "【Main】/【Action】Choose 1 friendly Link Unit. It recovers 3 HP.
【Pilot】[Lucrezia Noin]
",
  imageUrl: "../images/cards/card/GD01-101.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  timing: "MAIN",
  pilotProperties: {
    name: "Lucrezia Noin",
    traits: [
      "oz",
    ],
    apModifier: 1,
    hpModifier: 0,
  },
  abilities: [
    {
      description: "【Main】/【Action】Choose 1 friendly Link Unit. It recovers 3 HP. 【Pilot】[Lucrezia Noin]",
      effect: {
        type: "RECOVER_HP",
        amount: 3,
        target: {
          type: "self",
        },
      },
    },
  ],
};
