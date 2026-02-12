import type { CharacterCard } from "@tcg/lorcana-types";

export const boltDownButNotOut: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
      id: "1q7-1",
      name: "NONE OF YOUR POWERS ARE WORKING",
      text: "NONE OF YOUR POWERS ARE WORKING This character enters play exerted.",
      type: "static",
    },
  ],
  cardNumber: 29,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "e040a528160f7b3956e6235a08255d4cfd7ef81a",
  },
  franchise: "Bolt",
  fullName: "Bolt - Down but Not Out",
  id: "1q7",
  inkType: ["amber", "steel"],
  inkable: true,
  lore: 4,
  missingTests: true,
  name: "Bolt",
  set: "008",
  strength: 0,
  text: "NONE OF YOUR POWERS ARE WORKING This character enters play exerted.",
  version: "Down but Not Out",
  willpower: 4,
};
