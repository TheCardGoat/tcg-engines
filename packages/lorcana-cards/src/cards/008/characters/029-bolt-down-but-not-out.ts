import type { CharacterCard } from "@tcg/lorcana-types";

export const boltDownButNotOut: CharacterCard = {
  id: "1q7",
  cardType: "character",
  name: "Bolt",
  version: "Down but Not Out",
  fullName: "Bolt - Down but Not Out",
  inkType: ["amber", "steel"],
  franchise: "Bolt",
  set: "008",
  text: "NONE OF YOUR POWERS ARE WORKING This character enters play exerted.",
  cost: 3,
  strength: 0,
  willpower: 4,
  lore: 4,
  cardNumber: 29,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e040a528160f7b3956e6235a08255d4cfd7ef81a",
  },
  abilities: [
    {
      id: "1q7-1",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
      name: "NONE OF YOUR POWERS ARE WORKING",
      text: "NONE OF YOUR POWERS ARE WORKING This character enters play exerted.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
