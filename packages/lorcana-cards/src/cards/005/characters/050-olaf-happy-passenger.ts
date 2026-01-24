import type { CharacterCard } from "@tcg/lorcana-types";

export const olafHappyPassenger: CharacterCard = {
  id: "trf",
  cardType: "character",
  name: "Olaf",
  version: "Happy Passenger",
  fullName: "Olaf - Happy Passenger",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "005",
  text: "CLEAR THE PATH For each exerted character opponents have in play, you pay 1 {I} less to play this character.\nEvasive (Only characters with Evasive can challenge this character.)",
  cost: 9,
  strength: 6,
  willpower: 6,
  lore: 3,
  cardNumber: 50,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "6b436a5973bdf158f42db6f0468d40f368f6e4e9",
  },
  abilities: [
    {
      id: "trf-1",
      type: "action",
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "CLEAR THE PATH For each exerted character opponents have in play, you pay 1 {I} less to play this character.",
    },
    {
      id: "trf-2",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
