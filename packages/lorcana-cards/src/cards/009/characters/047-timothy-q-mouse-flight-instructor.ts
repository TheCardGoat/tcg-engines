import type { CharacterCard } from "@tcg/lorcana-types";

export const timothyQMouseFlightInstructor: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
      id: "101-1",
      text: "LET'S SHOW 'EM, DUMBO! While you have a character with Evasive in play, this character gets +1 {L}.",
      type: "action",
    },
  ],
  cardNumber: 47,
  cardType: "character",
  classifications: ["Storyborn", "Mentor"],
  cost: 2,
  externalIds: {
    ravensburger: "83c5d69561cb4f019f39e91441460af1cc3d538a",
  },
  franchise: "Dumbo",
  fullName: "Timothy Q. Mouse - Flight Instructor",
  id: "101",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Timothy Q. Mouse",
  set: "009",
  strength: 1,
  text: "LET'S SHOW 'EM, DUMBO! While you have a character with Evasive in play, this character gets +1 {L}.",
  version: "Flight Instructor",
  willpower: 4,
};
