import type { CharacterCard } from "@tcg/lorcana-types";

export const pigletPoohPirateCaptain: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "51i-1",
      text: "AND I'M THE CAPTAIN! While you have 2 or more other characters in play, this character gets +2 {L}.",
      type: "action",
    },
  ],
  cardNumber: 16,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Pirate", "Captain"],
  cost: 2,
  externalIds: {
    ravensburger: "122c433c05a0334dea67706084da9d47eef28c95",
  },
  franchise: "Winnie the Pooh",
  fullName: "Piglet - Pooh Pirate Captain",
  id: "51i",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Piglet",
  set: "003",
  strength: 2,
  text: "AND I'M THE CAPTAIN! While you have 2 or more other characters in play, this character gets +2 {L}.",
  version: "Pooh Pirate Captain",
  willpower: 2,
};
