import type { CharacterCard } from "@tcg/lorcana-types";

export const flowerShySkunk: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "put-on-bottom",
        target: "CHOSEN_CHARACTER",
      },
      id: "ry8-1",
      name: "LOOKING FOR FRIENDS",
      text: "LOOKING FOR FRIENDS Whenever you play another character, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 76,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "64bcc8dbec56c1a40e869de72bbf82705d067936",
  },
  franchise: "Bambi",
  fullName: "Flower - Shy Skunk",
  id: "ry8",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Flower",
  set: "008",
  strength: 3,
  text: "LOOKING FOR FRIENDS Whenever you play another character, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
  version: "Shy Skunk",
  willpower: 3,
};
