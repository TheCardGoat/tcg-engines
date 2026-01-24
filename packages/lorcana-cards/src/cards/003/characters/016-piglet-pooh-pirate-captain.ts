import type { CharacterCard } from "@tcg/lorcana-types";

export const pigletPoohPirateCaptain: CharacterCard = {
  id: "51i",
  cardType: "character",
  name: "Piglet",
  version: "Pooh Pirate Captain",
  fullName: "Piglet - Pooh Pirate Captain",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "003",
  text: "AND I'M THE CAPTAIN! While you have 2 or more other characters in play, this character gets +2 {L}.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 16,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "122c433c05a0334dea67706084da9d47eef28c95",
  },
  abilities: [
    {
      id: "51i-1",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
      text: "AND I'M THE CAPTAIN! While you have 2 or more other characters in play, this character gets +2 {L}.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Pirate", "Captain"],
};
