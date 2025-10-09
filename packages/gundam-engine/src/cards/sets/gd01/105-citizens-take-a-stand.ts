import type { CommandCardDefinition } from "../../card-types";

export const CitizensTakeAStand: CommandCardDefinition = {
  id: "gd01-105",
  name: "Citizens, Take a Stand!",
  cardNumber: "GD01-105",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "rare",
  color: "green",
  level: 4,
  cost: 1,
  text: "【Burst】Add this card to your hand.
【Main】All your Units get AP+2 during this turn.
",
  imageUrl: "../images/cards/card/GD01-105.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  timing: "MAIN",
  abilities: [
    {
      trigger: "ON_BURST",
      description: "【Burst】 Add this card to your hand. 【Main】All your Units get AP+2 during this turn.",
      effect: {
        type: "MODIFY_STATS",
        attribute: "ap",
        modifier: 2,
        duration: "turn",
      },
    },
  ],
};
