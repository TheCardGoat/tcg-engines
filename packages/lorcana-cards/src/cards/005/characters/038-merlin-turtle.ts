import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinTurtle: CharacterCard = {
  id: "1ed",
  cardType: "character",
  name: "Merlin",
  version: "Turtle",
  fullName: "Merlin - Turtle",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "005",
  text: "GIVE ME TIME TO THINK When you play this character and when he leaves play, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 38,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b59a5b35d2109955f13256931685e835cd3a6b47",
  },
  abilities: [
    {
      id: "1ed-1",
      type: "triggered",
      name: "GIVE ME TIME TO THINK When you play this character and",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "scry",
            amount: 2,
            target: "CONTROLLER",
            destinations: [
              {
                zone: "deck-bottom",
                remainder: true,
                ordering: "player-choice",
              },
            ],
          },
          {
            type: "put-on-bottom",
            target: "CHOSEN_CHARACTER",
          },
        ],
      },
      text: "GIVE ME TIME TO THINK When you play this character and when he leaves play, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
};
