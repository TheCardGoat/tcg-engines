import type { CharacterCard } from "@tcg/lorcana-types";

export const turboRoyalHack: CharacterCard = {
  abilities: [
    {
      id: "1fa-1",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
  ],
  cardNumber: 106,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Racer"],
  cost: 2,
  externalIds: {
    ravensburger: "b8da8904ffbfda9ff8696e65ffc6d53e7848dbad",
  },
  franchise: "Wreck It Ralph",
  fullName: "Turbo - Royal Hack",
  id: "1fa",
  inkType: ["ruby"],
  inkable: false,
  lore: 1,
  missingImplementation: true,
  missingTests: true,
  name: "Turbo",
  set: "005",
  strength: 2,
  text: "Rush (This character can challenge the turn they're played.)\nGAME JUMP This character also counts as being named King Candy for Shift.",
  version: "Royal Hack",
  willpower: 3,
};
