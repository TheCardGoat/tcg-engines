import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarLampThief: CharacterCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 2,
            destinations: [
              {
                ordering: "player-choice",
                remainder: true,
                zone: "deck-bottom",
              },
            ],
            target: "CONTROLLER",
            type: "scry",
          },
          {
            target: "CHOSEN_CHARACTER",
            type: "put-on-bottom",
          },
        ],
        type: "sequence",
      },
      id: "eye-1",
      name: "I AM YOUR MASTER NOW",
      text: "I AM YOUR MASTER NOW When you play this character, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 59,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  cost: 3,
  externalIds: {
    ravensburger: "35e65e00328e23cb522209e460c94442dcdfae23",
  },
  franchise: "Aladdin",
  fullName: "Jafar - Lamp Thief",
  id: "eye",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Jafar",
  set: "009",
  strength: 2,
  text: "I AM YOUR MASTER NOW When you play this character, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
  version: "Lamp Thief",
  willpower: 2,
};
