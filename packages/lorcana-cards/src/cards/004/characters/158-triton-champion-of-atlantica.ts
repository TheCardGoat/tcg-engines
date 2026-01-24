import type { CharacterCard } from "@tcg/lorcana-types";

export const tritonChampionOfAtlantica: CharacterCard = {
  id: "1vc",
  cardType: "character",
  name: "Triton",
  version: "Champion of Atlantica",
  fullName: "Triton - Champion of Atlantica",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "004",
  text: "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Triton.)\nIMPOSING PRESENCE Opposing characters get -1 {S} for each location you have in play.",
  cost: 9,
  strength: 7,
  willpower: 9,
  lore: 3,
  cardNumber: 158,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f2fe9fa097286b7fd01ef42ad1ab79f945b35dd5",
  },
  abilities: [
    {
      id: "1vc-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 6,
      },
      text: "Shift 6",
    },
    {
      id: "1vc-2",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "CHOSEN_CHARACTER",
      },
      name: "IMPOSING PRESENCE Opposing",
      text: "IMPOSING PRESENCE Opposing characters get -1 {S} for each location you have in play.",
    },
  ],
  classifications: ["Floodborn", "King"],
};
