import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinTurtle: CharacterCard = {
  abilities: [
    {
      effect: {
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
        type: "sequence",
      },
      id: "1ed-1",
      name: "GIVE ME TIME TO THINK When you play this character and",
      text: "GIVE ME TIME TO THINK When you play this character and when he leaves play, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 38,
  cardType: "character",
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
  cost: 4,
  externalIds: {
    ravensburger: "b59a5b35d2109955f13256931685e835cd3a6b47",
  },
  franchise: "Sword in the Stone",
  fullName: "Merlin - Turtle",
  id: "1ed",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Merlin",
  set: "005",
  strength: 3,
  text: "GIVE ME TIME TO THINK When you play this character and when he leaves play, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
  version: "Turtle",
  willpower: 3,
};
