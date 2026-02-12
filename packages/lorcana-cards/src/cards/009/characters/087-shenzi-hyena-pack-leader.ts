import type { CharacterCard } from "@tcg/lorcana-types";

export const shenziHyenaPackLeader: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 3,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "qk2-1",
      text: "I'LL HANDLE THIS While this character is at a location, she gets +3 {S}.",
      type: "static",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "optional",
      },
      id: "qk2-2",
      text: "WHAT'S THE HURRY? While this character is at a location, whenever she challenges another character, you may draw a card.",
      type: "static",
    },
  ],
  cardNumber: 87,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Hyena"],
  cost: 4,
  externalIds: {
    ravensburger: "5fb748398e1696271b4a787f6c9bb1200b4a5b1e",
  },
  franchise: "Lion King",
  fullName: "Shenzi - Hyena Pack Leader",
  id: "qk2",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Shenzi",
  set: "009",
  strength: 0,
  text: "I'LL HANDLE THIS While this character is at a location, she gets +3 {S}.\nWHAT'S THE HURRY? While this character is at a location, whenever she challenges another character, you may draw a card.",
  version: "Hyena Pack Leader",
  willpower: 6,
};
