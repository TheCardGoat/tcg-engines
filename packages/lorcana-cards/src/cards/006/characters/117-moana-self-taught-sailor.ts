import type { CharacterCard } from "@tcg/lorcana-types";

export const moanaSelftaughtSailor: CharacterCard = {
  abilities: [
    {
      effect: {
        restriction: "cant-challenge",
        target: "SELF",
        type: "restriction",
      },
      id: "13o-1",
      name: "LEARNING THE ROPES",
      text: "LEARNING THE ROPES This character can't challenge unless you have a Captain character in play.",
      type: "static",
    },
  ],
  cardNumber: 117,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Princess", "Pirate"],
  cost: 1,
  externalIds: {
    ravensburger: "8eff1d2190a411b5fb11b72010f471fd055dde07",
  },
  franchise: "Moana",
  fullName: "Moana - Self-Taught Sailor",
  id: "13o",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Moana",
  set: "006",
  strength: 3,
  text: "LEARNING THE ROPES This character can't challenge unless you have a Captain character in play.",
  version: "Self-Taught Sailor",
  willpower: 2,
};
