import type { CharacterCard } from "@tcg/lorcana-types";

export const madamMimRivalOfMerlin: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "dz2-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      cost: { exert: true },
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
      },
      id: "dz2-2",
      text: "GRUESOME AND GRIM {E} — Play a character with cost 4 or less for free. They gain Rush. At the end of the turn, banish them.",
      type: "activated",
    },
  ],
  cardNumber: 48,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "Sorcerer"],
  cost: 5,
  externalIds: {
    ravensburger: "325d620e287565d4121f1cd33cb3e2778aa78e65",
  },
  franchise: "Sword in the Stone",
  fullName: "Madam Mim - Rival of Merlin",
  id: "dz2",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Madam Mim",
  set: "002",
  strength: 2,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Madam Mim.)\nGRUESOME AND GRIM {E} — Play a character with cost 4 or less for free. They gain Rush. At the end of the turn, banish them. (They can challenge the turn they're played.)",
  version: "Rival of Merlin",
  willpower: 5,
};
