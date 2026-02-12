import type { CharacterCard } from "@tcg/lorcana-types";

export const painUnderworldImp: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "8up-1",
      text: "COMING, YOUR MOST LUGUBRIOUSNESS While this character has 5 {S} or more, he gets +2 {L}.",
      type: "action",
    },
  ],
  cardNumber: 86,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "1fe8193faae4a3e917c75b66570a89630455f0c7",
  },
  franchise: "Hercules",
  fullName: "Pain - Underworld Imp",
  id: "8up",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Pain",
  set: "002",
  strength: 1,
  text: "COMING, YOUR MOST LUGUBRIOUSNESS While this character has 5 {S} or more, he gets +2 {L}.",
  version: "Underworld Imp",
  willpower: 4,
};
