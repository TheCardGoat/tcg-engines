import type { CommandCardDefinition } from "@tcg/gundam-types";

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
  effects: [
    {
      id: "st03-013-effect-1",
      description:
        "【Burst】 Activate this card's 【Main】. 【Main】/【Action】Choose 1 enemy Unit. Deal 2 damage to it.",
      type: "TRIGGERED",
      timing: "BURST",
      action: {
        type: "DAMAGE",
        parameters: {
          target: {
            type: "unknown",
            rawText: "it",
          },
          amount: 2,
        },
      },
    },
  ],
};
