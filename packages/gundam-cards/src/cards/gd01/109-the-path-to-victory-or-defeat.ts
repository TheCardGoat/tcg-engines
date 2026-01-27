import type { CommandCardDefinition } from "@tcg/gundam-types";

export const ThePathToVictoryOrDefeat: CommandCardDefinition = {
  id: "gd01-109",
  name: "The Path to Victory or Defeat",
  cardNumber: "GD01-109",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "common",
  color: "green",
  level: 5,
  cost: 1,
  text: "【Main】Look at the top 5 cards of your deck. You may reveal 1 (Operation Meteor)/(G Team) Unit card/Pilot card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-109.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  timing: "MAIN",
  effects: [
    {
      id: "gd01-109-effect-1",
      description:
        "【Main】Look at the top 5 cards of your deck. You may reveal 1 (Operation Meteor)/(G Team) Unit card/Pilot card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
      type: "CONSTANT",
      action: {
        type: "CUSTOM",
        text: "【Main】Look at the top 5 cards of your deck. You may reveal 1 (Operation Meteor)/(G Team) Unit card/Pilot card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
      },
    },
  ],
};
