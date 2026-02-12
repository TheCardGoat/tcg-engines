import type { CharacterCard } from "@tcg/lorcana-types";

export const vanellopeVonSchweetzSugarRushPrincess: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 2,
      },
      id: "s65-1",
      keyword: "Shift",
      text: "Shift 2",
      type: "keyword",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "CHOSEN_CHARACTER",
      },
      id: "s65-2",
      name: "I HEREBY DECREE",
      text: "I HEREBY DECREE Whenever you play another Princess character, all opposing characters get -1 {S} until the start of your next turn.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 19,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Princess", "Racer"],
  cost: 4,
  externalIds: {
    ravensburger: "6587479529519fdd93c24cecd1d0c2d05d2524b1",
  },
  franchise: "Wreck It Ralph",
  fullName: "Vanellope von Schweetz - Sugar Rush Princess",
  id: "s65",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Vanellope von Schweetz",
  set: "005",
  strength: 2,
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Vanellope von Schweetz.)\nI HEREBY DECREE Whenever you play another Princess character, all opposing characters get -1 {S} until the start of your next turn.",
  version: "Sugar Rush Princess",
  willpower: 4,
};
