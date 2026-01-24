import type { CharacterCard } from "@tcg/lorcana-types";

export const flowerShySkunk: CharacterCard = {
  id: "ry8",
  cardType: "character",
  name: "Flower",
  version: "Shy Skunk",
  fullName: "Flower - Shy Skunk",
  inkType: ["amethyst"],
  franchise: "Bambi",
  set: "008",
  text: "LOOKING FOR FRIENDS Whenever you play another character, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 76,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "64bcc8dbec56c1a40e869de72bbf82705d067936",
  },
  abilities: [
    {
      id: "ry8-1",
      type: "triggered",
      name: "LOOKING FOR FRIENDS",
      effect: {
        type: "put-on-bottom",
        target: "CHOSEN_CHARACTER",
      },
      text: "LOOKING FOR FRIENDS Whenever you play another character, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
