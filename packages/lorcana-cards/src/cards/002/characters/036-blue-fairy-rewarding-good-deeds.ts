import type { CharacterCard } from "@tcg/lorcana-types";

export const blueFairyRewardingGoodDeeds: CharacterCard = {
  id: "tv6",
  cardType: "character",
  name: "Blue Fairy",
  version: "Rewarding Good Deeds",
  fullName: "Blue Fairy - Rewarding Good Deeds",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "002",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nETHEREAL GLOW Whenever you play a Floodborn character, you may draw a card.",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 36,
  inkable: true,
  externalIds: {
    ravensburger: "6ba38008e226dd2b1f7f7d339eda6aa832fd6eb3",
  },
  abilities: [
    {
      id: "tv6-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
    {
      id: "tv6-2",
      text: "ETHEREAL GLOW Whenever you play a Floodborn character, you may draw a card.",
      name: "ETHEREAL GLOW",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Floodborn",
        },
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Ally", "Fairy"],
};
