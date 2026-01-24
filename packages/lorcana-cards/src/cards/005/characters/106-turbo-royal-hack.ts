import type { CharacterCard } from "@tcg/lorcana-types";

export const turboRoyalHack: CharacterCard = {
  id: "1fa",
  cardType: "character",
  name: "Turbo",
  version: "Royal Hack",
  fullName: "Turbo - Royal Hack",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "005",
  text: "Rush (This character can challenge the turn they're played.)\nGAME JUMP This character also counts as being named King Candy for Shift.",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 106,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b8da8904ffbfda9ff8696e65ffc6d53e7848dbad",
  },
  abilities: [
    {
      id: "1fa-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
  ],
  classifications: ["Storyborn", "Villain", "Racer"],
};
