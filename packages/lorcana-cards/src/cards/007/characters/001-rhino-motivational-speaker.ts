import type { CharacterCard } from "@tcg/lorcana-types";

export const rhinoMotivationalSpeaker: CharacterCard = {
  id: "15i",
  cardType: "character",
  name: "Rhino",
  version: "Motivational Speaker",
  fullName: "Rhino - Motivational Speaker",
  inkType: ["amber", "steel"],
  franchise: "Bolt",
  set: "007",
  text: "DESTINY CALLING Your other characters get +2 {W}.",
  cost: 6,
  strength: 4,
  willpower: 7,
  lore: 2,
  cardNumber: 1,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "95a56b1f8277a035af9afaaabfaf7215216b4ab9",
  },
  abilities: [
    {
      id: "15i-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "willpower",
        modifier: 2,
        target: "YOUR_CHARACTERS",
      },
      name: "DESTINY CALLING Your other",
      text: "DESTINY CALLING Your other characters get +2 {W}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
