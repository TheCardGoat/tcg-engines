import type { CharacterCard } from "@tcg/lorcana-types";

export const lawrenceJealousManservant: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 4,
        target: "SELF",
      },
      id: "1rx-1",
      text: "PAYBACK While this character has no damage, he gets +4 {S}.",
      type: "static",
    },
  ],
  cardNumber: 187,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "e673e28c8e84ee6a6a337c7ec4008fd12e0ff908",
  },
  franchise: "Princess and the Frog",
  fullName: "Lawrence - Jealous Manservant",
  id: "1rx",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Lawrence",
  set: "009",
  strength: 0,
  text: "PAYBACK While this character has no damage, he gets +4 {S}.",
  version: "Jealous Manservant",
  willpower: 4,
};
