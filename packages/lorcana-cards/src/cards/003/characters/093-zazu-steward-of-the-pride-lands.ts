import type { CharacterCard } from "@tcg/lorcana-types";

export const zazuStewardOfThePrideLands: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "18g-1",
      text: "IT'S TIME TO GO! While this character is at a location, he gets +1 {L}.",
      type: "static",
    },
  ],
  cardNumber: 93,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 1,
  externalIds: {
    ravensburger: "a032ed20032f8c710c904a4c2acaa648433e35c1",
  },
  franchise: "Lion King",
  fullName: "Zazu - Steward of the Pride Lands",
  id: "18g",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Zazu",
  set: "003",
  strength: 2,
  text: "IT'S TIME TO GO! While this character is at a location, he gets +1 {L}.",
  version: "Steward of the Pride Lands",
  willpower: 1,
};
