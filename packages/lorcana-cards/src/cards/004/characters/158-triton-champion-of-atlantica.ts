import type { CharacterCard } from "@tcg/lorcana-types";

export const tritonChampionOfAtlantica: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 6,
      },
      id: "1vc-1",
      keyword: "Shift",
      text: "Shift 6",
      type: "keyword",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "CHOSEN_CHARACTER",
      },
      id: "1vc-2",
      name: "IMPOSING PRESENCE Opposing",
      text: "IMPOSING PRESENCE Opposing characters get -1 {S} for each location you have in play.",
      type: "static",
    },
  ],
  cardNumber: 158,
  cardType: "character",
  classifications: ["Floodborn", "King"],
  cost: 9,
  externalIds: {
    ravensburger: "f2fe9fa097286b7fd01ef42ad1ab79f945b35dd5",
  },
  franchise: "Little Mermaid",
  fullName: "Triton - Champion of Atlantica",
  id: "1vc",
  inkType: ["sapphire"],
  inkable: true,
  lore: 3,
  missingTests: true,
  name: "Triton",
  set: "004",
  strength: 7,
  text: "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Triton.)\nIMPOSING PRESENCE Opposing characters get -1 {S} for each location you have in play.",
  version: "Champion of Atlantica",
  willpower: 9,
};
