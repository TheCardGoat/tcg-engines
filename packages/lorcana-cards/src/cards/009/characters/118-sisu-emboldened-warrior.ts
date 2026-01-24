import type { CharacterCard } from "@tcg/lorcana-types";

export const sisuEmboldenedWarrior: CharacterCard = {
  id: "1df",
  cardType: "character",
  name: "Sisu",
  version: "Emboldened Warrior",
  fullName: "Sisu - Emboldened Warrior",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "009",
  text: "SURGE OF POWER This character gets +1 {S} for each card in opponents' hands.",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 118,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b22a4c15d3d32e5cf4e451e8aa8176001b9d2255",
  },
  abilities: [
    {
      id: "1df-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
      },
      text: "SURGE OF POWER This character gets +1 {S} for each card in opponents' hands.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Deity", "Dragon"],
};
