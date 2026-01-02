import type { CharacterCard } from "@tcg/lorcana";

export const donaldDuckMusketeer: CharacterCard = {
  id: "1te",
  cardType: "character",
  name: "Donald Duck",
  version: "Musketeer",
  fullName: "Donald Duck - Musketeer",
  inkType: ["steel"],
  set: "001",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSTAY ALERT! During your turn, your Musketeer characters gain Evasive. (They can challenge characters with Evasive.)",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  cardNumber: 177,
  inkable: true,
  externalIds: {
    ravensburger: "eb0f321c8ffffb426862310ebc9a55e6e2d2d5df",
  },
  abilities: [
    {
      id: "1te-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
    {
      id: "1te-2",
      text: "STAY ALERT! During your turn, your Musketeer characters gain Evasive.",
      name: "STAY ALERT!",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "YOUR_CHARACTERS",
      },
    },
  ],
  classifications: ["Dreamborn", "Hero", "Musketeer"],
};
