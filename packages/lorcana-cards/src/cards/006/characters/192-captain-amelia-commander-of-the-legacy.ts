import type { CharacterCard } from "@tcg/lorcana-types";

export const captainAmeliaCommanderOfTheLegacy: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: "SELF",
      },
      id: "1ln-1",
      name: "DRIVELING GALOOTS",
      text: "DRIVELING GALOOTS This character can't be challenged by Pirate characters.",
      type: "static",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "YOUR_CHARACTERS",
        value: 1,
      },
      id: "1ln-2",
      text: "EVERYTHING SHIPSHAPE While being challenged, your other characters gain Resist +1.",
      type: "static",
    },
  ],
  cardNumber: 192,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Alien", "Captain"],
  cost: 4,
  externalIds: {
    ravensburger: "cfbdd1113e262b66941b16da85701f5a8aa882eb",
  },
  franchise: "Treasure Planet",
  fullName: "Captain Amelia - Commander of the Legacy",
  id: "1ln",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Captain Amelia",
  set: "006",
  strength: 1,
  text: "DRIVELING GALOOTS This character can't be challenged by Pirate characters.\nEVERYTHING SHIPSHAPE While being challenged, your other characters gain Resist +1. (Damage dealt to them is reduced by 1.)",
  version: "Commander of the Legacy",
  willpower: 4,
};
