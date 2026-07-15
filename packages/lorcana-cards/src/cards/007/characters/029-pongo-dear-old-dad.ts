import type { CharacterCard } from "@tcg/lorcana-types";

export const pongoDearOldDad: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cost: "free",
          from: "hand",
          type: "play-card",
        },
        type: "optional",
      },
      id: "lmd-1",
      text: "FOUND YOU, YOU LITTLE RASCAL At the start of your turn, look at the cards in your inkwell. You may play a Puppy character from there for free.",
      type: "action",
    },
  ],
  cardNumber: 29,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 6,
  externalIds: {
    ravensburger: "4ded36b061197a0ad11ed674df025e831934904a",
  },
  franchise: "101 Dalmatians",
  fullName: "Pongo - Dear Old Dad",
  id: "lmd",
  inkType: ["amber", "sapphire"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Pongo",
  set: "007",
  strength: 5,
  text: "FOUND YOU, YOU LITTLE RASCAL At the start of your turn, look at the cards in your inkwell. You may play a Puppy character from there for free.",
  version: "Dear Old Dad",
  willpower: 5,
};
