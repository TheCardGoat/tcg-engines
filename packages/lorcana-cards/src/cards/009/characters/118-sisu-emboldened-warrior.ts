import type { CharacterCard } from "@tcg/lorcana-types";

export const sisuEmboldenedWarrior: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
      },
      id: "1df-1",
      text: "SURGE OF POWER This character gets +1 {S} for each card in opponents' hands.",
      type: "static",
    },
  ],
  cardNumber: 118,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Deity", "Dragon"],
  cost: 3,
  externalIds: {
    ravensburger: "b22a4c15d3d32e5cf4e451e8aa8176001b9d2255",
  },
  franchise: "Raya and the Last Dragon",
  fullName: "Sisu - Emboldened Warrior",
  id: "1df",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Sisu",
  set: "009",
  strength: 1,
  text: "SURGE OF POWER This character gets +1 {S} for each card in opponents' hands.",
  version: "Emboldened Warrior",
  willpower: 4,
};
