import type { CommandCardDefinition } from "../../card-types";

export const BattleOfAces: CommandCardDefinition = {
  id: "gd01-111",
  name: "Battle of Aces",
  cardNumber: "GD01-111",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "rare",
  color: "red",
  level: 3,
  cost: 2,
  text: "【Burst】Choose 1 enemy Unit. Deal 2 damage to it.\n【Main】/【Action】Choose 1 damaged enemy Unit. Deal 3 damage to it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-111.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  timing: "MAIN",
  abilities: [
    {
      trigger: "ON_BURST",
      description:
        "【Burst】 Choose 1 enemy Unit. Deal 2 damage to it. 【Main】/【Action】Choose 1 damaged enemy Unit. Deal 3 damage to it.",
      effect: {
        type: "DAMAGE",
        amount: 2,
        target: {
          type: "unknown",
          rawText: "it",
        },
      },
    },
  ],
};
