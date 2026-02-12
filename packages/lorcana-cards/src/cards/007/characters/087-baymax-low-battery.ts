import type { CharacterCard } from "@tcg/lorcana-types";

export const baymaxLowBattery: CharacterCard = {
  abilities: [
    {
      effect: {
        restriction: "enters-play-exerted",
        target: "SELF",
        type: "restriction",
      },
      id: "10p-1",
      name: "SHHHHH",
      text: "SHHHHH This character enters play exerted.",
      type: "static",
    },
  ],
  cardNumber: 87,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Robot"],
  cost: 2,
  externalIds: {
    ravensburger: "8443d471af8ebbfb5a81734a59bca908a12fa53e",
  },
  franchise: "Big Hero 6",
  fullName: "Baymax - Low Battery",
  id: "10p",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Baymax",
  set: "007",
  strength: 3,
  text: "SHHHHH This character enters play exerted.",
  version: "Low Battery",
  willpower: 2,
};
