import type { CharacterCard } from "@tcg/lorcana-types";

export const captainAmeliaCommanderOfTheLegacy: CharacterCard = {
  id: "1ln",
  cardType: "character",
  name: "Captain Amelia",
  version: "Commander of the Legacy",
  fullName: "Captain Amelia - Commander of the Legacy",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  text: "DRIVELING GALOOTS This character can't be challenged by Pirate characters.\nEVERYTHING SHIPSHAPE While being challenged, your other characters gain Resist +1. (Damage dealt to them is reduced by 1.)",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 192,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cfbdd1113e262b66941b16da85701f5a8aa882eb",
  },
  abilities: [
    {
      id: "1ln-1",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: "SELF",
      },
      name: "DRIVELING GALOOTS",
      text: "DRIVELING GALOOTS This character can't be challenged by Pirate characters.",
    },
    {
      id: "1ln-2",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "YOUR_CHARACTERS",
        value: 1,
      },
      text: "EVERYTHING SHIPSHAPE While being challenged, your other characters gain Resist +1.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Alien", "Captain"],
};
