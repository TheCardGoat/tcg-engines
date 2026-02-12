import type { CharacterCard } from "@tcg/lorcana-types";

export const blueFairyRewardingGoodDeeds: CharacterCard = {
  abilities: [
    {
      id: "tv6-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      id: "tv6-2",
      name: "ETHEREAL GLOW",
      text: "ETHEREAL GLOW Whenever you play a Floodborn character, you may draw a card.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Floodborn",
        },
      },
      type: "triggered",
    },
  ],
  cardNumber: 36,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Fairy"],
  cost: 2,
  externalIds: {
    ravensburger: "6ba38008e226dd2b1f7f7d339eda6aa832fd6eb3",
  },
  franchise: "Pinocchio",
  fullName: "Blue Fairy - Rewarding Good Deeds",
  id: "tv6",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  name: "Blue Fairy",
  set: "002",
  strength: 1,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nETHEREAL GLOW Whenever you play a Floodborn character, you may draw a card.",
  version: "Rewarding Good Deeds",
  willpower: 1,
};
