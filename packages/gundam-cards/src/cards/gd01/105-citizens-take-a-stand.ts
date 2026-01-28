import type { CommandCardDefinition } from "@tcg/gundam-types";

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
  text: "【Burst】Add this card to your hand.\n【Main】All your Units get AP+2 during this turn.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-105.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  timing: "MAIN",
  effects: [
    {
      id: "eff-c90qzixl5",
      type: "TRIGGERED",
      timing: "BURST",
      description: "Add this card to your hand.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "ADD_TO_HAND",
      },
    },
    {
      id: "eff-qe0sk428o",
      type: "CONSTANT",
      description: "All your Units get AP+2 during this turn.",
      restrictions: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "",
      },
    },
  ],
};
