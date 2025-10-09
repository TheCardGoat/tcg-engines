import type { CommandCardDefinition } from "../../card-types";

export const CloseCombat: CommandCardDefinition = {
  id: "st03-013",
  name: "Close Combat",
  cardNumber: "ST03-013",
  setCode: "ST03",
  cardType: "COMMAND",
  rarity: "common",
  color: "red",
  level: 2,
  cost: 2,
  text: "【Burst】Activate this card's 【Main】.\n【Main】/【Action】Choose 1 enemy Unit. Deal 2 damage to it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST03-013.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  timing: "MAIN",
  abilities: [
    {
      trigger: "ON_BURST",
      description:
        "【Burst】 Activate this card's 【Main】. 【Main】/【Action】Choose 1 enemy Unit. Deal 2 damage to it.",
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
