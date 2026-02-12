import type { CharacterCard } from "@tcg/lorcana-types";

export const rhinoMotivationalSpeaker: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "willpower",
        modifier: 2,
        target: "YOUR_CHARACTERS",
      },
      id: "15i-1",
      name: "DESTINY CALLING Your other",
      text: "DESTINY CALLING Your other characters get +2 {W}.",
      type: "static",
    },
  ],
  cardNumber: 1,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 6,
  externalIds: {
    ravensburger: "95a56b1f8277a035af9afaaabfaf7215216b4ab9",
  },
  franchise: "Bolt",
  fullName: "Rhino - Motivational Speaker",
  id: "15i",
  inkType: ["amber", "steel"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Rhino",
  set: "007",
  strength: 4,
  text: "DESTINY CALLING Your other characters get +2 {W}.",
  version: "Motivational Speaker",
  willpower: 7,
};
