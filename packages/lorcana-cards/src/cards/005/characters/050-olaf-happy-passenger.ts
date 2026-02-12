import type { CharacterCard } from "@tcg/lorcana-types";

export const olafHappyPassenger: CharacterCard = {
  abilities: [
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "trf-1",
      text: "CLEAR THE PATH For each exerted character opponents have in play, you pay 1 {I} less to play this character.",
      type: "action",
    },
    {
      id: "trf-2",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
  cardNumber: 50,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 9,
  externalIds: {
    ravensburger: "6b436a5973bdf158f42db6f0468d40f368f6e4e9",
  },
  franchise: "Frozen",
  fullName: "Olaf - Happy Passenger",
  id: "trf",
  inkType: ["amethyst"],
  inkable: false,
  lore: 3,
  missingTests: true,
  name: "Olaf",
  set: "005",
  strength: 6,
  text: "CLEAR THE PATH For each exerted character opponents have in play, you pay 1 {I} less to play this character.\nEvasive (Only characters with Evasive can challenge this character.)",
  version: "Happy Passenger",
  willpower: 6,
};
