import type { CharacterCard } from "@tcg/lorcana-types";

export const miloThatchSpiritedScholar: CharacterCard = {
  id: "1cr",
  cardType: "character",
  name: "Milo Thatch",
  version: "Spirited Scholar",
  fullName: "Milo Thatch - Spirited Scholar",
  inkType: ["ruby"],
  franchise: "Atlantis",
  set: "003",
  text: "I'M YOUR MAN! While this character is at a location, he gets +2 {S}.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 115,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "afc915c8e0d6e76a43d923beb2bf5400009bad5e",
  },
  abilities: [
    {
      id: "1cr-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      text: "I'M YOUR MAN! While this character is at a location, he gets +2 {S}.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
