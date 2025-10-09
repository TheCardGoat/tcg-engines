import type { CommandCardDefinition } from "../../card-types";

export const ZeonRemnantForces: CommandCardDefinition = {
  id: "gd01-115",
  name: "Zeon Remnant Forces",
  cardNumber: "GD01-115",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "uncommon",
  color: "red",
  level: 2,
  cost: 1,
  text: "【Main】/【Action】Choose 1 enemy Unit. Deal 1 damage to it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-115.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  timing: "MAIN",
  abilities: [
    {
      description:
        "【Main】/【Action】Choose 1 enemy Unit. Deal 1 damage to it.",
      effect: {
        type: "DAMAGE",
        amount: 1,
        target: {
          type: "unknown",
          rawText: "it",
        },
      },
    },
  ],
};
