import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckBuccaneer: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "YOUR_CHARACTERS",
        duration: "this-turn",
      },
      id: "va5-1",
      name: "BOARDING PARTY",
      text: "BOARDING PARTY During your turn, whenever this character banishes a character in a challenge, your other characters get +1 {L} this turn.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 179,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Pirate", "Captain"],
  cost: 4,
  externalIds: {
    ravensburger: "70bdce65e25cf1ef00c6df3f40197bc6ed86aacc",
  },
  fullName: "Donald Duck - Buccaneer",
  id: "va5",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Donald Duck",
  set: "004",
  strength: 3,
  text: "BOARDING PARTY During your turn, whenever this character banishes a character in a challenge, your other characters get +1 {L} this turn.",
  version: "Buccaneer",
  willpower: 4,
};
