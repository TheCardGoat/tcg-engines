import type { CharacterCard } from "@tcg/lorcana-types";

export const vanellopeVonSchweetzSugarRushPrincess: CharacterCard = {
  id: "s65",
  cardType: "character",
  name: "Vanellope von Schweetz",
  version: "Sugar Rush Princess",
  fullName: "Vanellope von Schweetz - Sugar Rush Princess",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "005",
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Vanellope von Schweetz.)\nI HEREBY DECREE Whenever you play another Princess character, all opposing characters get -1 {S} until the start of your next turn.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 19,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6587479529519fdd93c24cecd1d0c2d05d2524b1",
  },
  abilities: [
    {
      id: "s65-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 2,
      },
      text: "Shift 2",
    },
    {
      id: "s65-2",
      type: "triggered",
      name: "I HEREBY DECREE",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "CHOSEN_CHARACTER",
      },
      text: "I HEREBY DECREE Whenever you play another Princess character, all opposing characters get -1 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess", "Racer"],
};
