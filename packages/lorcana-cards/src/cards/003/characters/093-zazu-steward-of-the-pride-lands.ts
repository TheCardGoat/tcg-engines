import type { CharacterCard } from "@tcg/lorcana-types";

export const zazuStewardOfThePrideLands: CharacterCard = {
  id: "18g",
  cardType: "character",
  name: "Zazu",
  version: "Steward of the Pride Lands",
  fullName: "Zazu - Steward of the Pride Lands",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "003",
  text: "IT'S TIME TO GO! While this character is at a location, he gets +1 {L}.",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 93,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a032ed20032f8c710c904a4c2acaa648433e35c1",
  },
  abilities: [
    {
      id: "18g-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
      text: "IT'S TIME TO GO! While this character is at a location, he gets +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
