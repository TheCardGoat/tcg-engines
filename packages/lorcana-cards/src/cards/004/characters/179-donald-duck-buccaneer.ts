import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckBuccaneer: CharacterCard = {
  id: "va5",
  cardType: "character",
  name: "Donald Duck",
  version: "Buccaneer",
  fullName: "Donald Duck - Buccaneer",
  inkType: ["steel"],
  set: "004",
  text: "BOARDING PARTY During your turn, whenever this character banishes a character in a challenge, your other characters get +1 {L} this turn.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 179,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "70bdce65e25cf1ef00c6df3f40197bc6ed86aacc",
  },
  abilities: [
    {
      id: "va5-1",
      type: "triggered",
      name: "BOARDING PARTY",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "YOUR_CHARACTERS",
        duration: "this-turn",
      },
      text: "BOARDING PARTY During your turn, whenever this character banishes a character in a challenge, your other characters get +1 {L} this turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Pirate", "Captain"],
};
