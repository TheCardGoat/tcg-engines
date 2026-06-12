import type { CharacterCard } from "@tcg/lorcana-types";
import { tritonChampionOfAtlanticaI18n } from "./158-triton-champion-of-atlantica.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const tritonChampionOfAtlantica: CharacterCard = {
  id: "0J0",
  canonicalId: "ci_0J0",
  reprints: ["set4-158"],
  cardType: "character",
  name: "Triton",
  version: "Champion of Atlantica",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 158,
  rarity: "legendary",
  cost: 9,
  strength: 7,
  willpower: 9,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_9ddadbe1950b402696855e6668e5cf8f",
    tcgPlayer: 550611,
  },
  text: [
    {
      title: "Shift 6",
    },
    {
      title: "IMPOSING PRESENCE",
      description: "Opposing characters get -1 {S} for each location you have in play.",
    },
  ],
  classifications: ["Floodborn", "King"],
  abilities: [
    shift(6),
    {
      effect: {
        modifier: {
          type: "filtered-count",
          filters: [],
          owner: "you",
          cardType: "location",
          multiplier: -1,
        },
        stat: "strength",
        target: "ALL_OPPOSING_CHARACTERS",
        type: "modify-stat",
      },
      id: "1vc-2",
      name: "IMPOSING PRESENCE",
      text: "IMPOSING PRESENCE Opposing characters get -1 {S} for each location you have in play.",
      type: "static",
    },
  ],
  i18n: tritonChampionOfAtlanticaI18n,
};
