import type { CharacterCard } from "@tcg/lorcana-types";

export const madamMimRivalOfMerlin: CharacterCard = {
  id: "dz2",
  cardType: "character",
  name: "Madam Mim",
  version: "Rival of Merlin",
  fullName: "Madam Mim - Rival of Merlin",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Madam Mim.)\nGRUESOME AND GRIM {E} — Play a character with cost 4 or less for free. They gain Rush. At the end of the turn, banish them. (They can challenge the turn they're played.)",
  cost: 5,
  strength: 2,
  willpower: 5,
  lore: 2,
  cardNumber: 48,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "325d620e287565d4121f1cd33cb3e2778aa78e65",
  },
  abilities: [
    {
      id: "dz2-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3",
    },
    {
      id: "dz2-2",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
      },
      text: "GRUESOME AND GRIM {E} — Play a character with cost 4 or less for free. They gain Rush. At the end of the turn, banish them.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Sorcerer"],
};
