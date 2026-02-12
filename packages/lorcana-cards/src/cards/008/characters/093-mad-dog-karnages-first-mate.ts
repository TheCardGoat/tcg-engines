import type { CharacterCard } from "@tcg/lorcana-types";

export const madDogKarnagesFirstMate: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression: "you have a character named Don Karnage in play",
        },
        then: {
          type: "play-card",
          from: "hand",
        },
        type: "conditional",
      },
      id: "19p-1",
      text: "ARE YOU SURE THIS IS SAFE, CAPTAIN? If you have a character named Don Karnage in play, you pay 1 {I} less to play this character.",
      type: "action",
    },
  ],
  cardNumber: 93,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Pirate"],
  cost: 4,
  externalIds: {
    ravensburger: "a4b3741414a7ffbb2b4a8666523aba01f6ae53ec",
  },
  franchise: "Talespin",
  fullName: "Mad Dog - Karnage's First Mate",
  id: "19p",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Mad Dog",
  set: "008",
  strength: 4,
  text: "ARE YOU SURE THIS IS SAFE, CAPTAIN? If you have a character named Don Karnage in play, you pay 1 {I} less to play this character.",
  version: "Karnage's First Mate",
  willpower: 4,
};
