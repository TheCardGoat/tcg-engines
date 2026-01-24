import type { CharacterCard } from "@tcg/lorcana-types";

export const shenziHyenaPackLeader: CharacterCard = {
  id: "qk2",
  cardType: "character",
  name: "Shenzi",
  version: "Hyena Pack Leader",
  fullName: "Shenzi - Hyena Pack Leader",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "009",
  text: "I'LL HANDLE THIS While this character is at a location, she gets +3 {S}.\nWHAT'S THE HURRY? While this character is at a location, whenever she challenges another character, you may draw a card.",
  cost: 4,
  strength: 0,
  willpower: 6,
  lore: 1,
  cardNumber: 87,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5fb748398e1696271b4a787f6c9bb1200b4a5b1e",
  },
  abilities: [
    {
      id: "qk2-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        target: "SELF",
      },
      text: "I'LL HANDLE THIS While this character is at a location, she gets +3 {S}.",
    },
    {
      id: "qk2-2",
      type: "static",
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "WHAT'S THE HURRY? While this character is at a location, whenever she challenges another character, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Hyena"],
};
