import type { CharacterCard } from "@tcg/lorcana-types";

export const baymaxLowBattery: CharacterCard = {
  id: "10p",
  cardType: "character",
  name: "Baymax",
  version: "Low Battery",
  fullName: "Baymax - Low Battery",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "007",
  text: "SHHHHH This character enters play exerted.",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 2,
  cardNumber: 87,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8443d471af8ebbfb5a81734a59bca908a12fa53e",
  },
  abilities: [
    {
      id: "10p-1",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
      name: "SHHHHH",
      text: "SHHHHH This character enters play exerted.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Robot"],
};
