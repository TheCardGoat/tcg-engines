import type { CharacterCard } from "@tcg/lorcana-types";

export const pongoDearOldDad: CharacterCard = {
  id: "lmd",
  cardType: "character",
  name: "Pongo",
  version: "Dear Old Dad",
  fullName: "Pongo - Dear Old Dad",
  inkType: ["amber", "sapphire"],
  franchise: "101 Dalmatians",
  set: "007",
  text: "FOUND YOU, YOU LITTLE RASCAL At the start of your turn, look at the cards in your inkwell. You may play a Puppy character from there for free.",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 29,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "4ded36b061197a0ad11ed674df025e831934904a",
  },
  abilities: [
    {
      id: "lmd-1",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          from: "hand",
          cost: "free",
        },
        chooser: "CONTROLLER",
      },
      text: "FOUND YOU, YOU LITTLE RASCAL At the start of your turn, look at the cards in your inkwell. You may play a Puppy character from there for free.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
