import type { CharacterCard } from "@tcg/lorcana-types";

export const miloThatchSpiritedScholar: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      id: "1cr-1",
      text: "I'M YOUR MAN! While this character is at a location, he gets +2 {S}.",
      type: "static",
    },
  ],
  cardNumber: 115,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 2,
  externalIds: {
    ravensburger: "afc915c8e0d6e76a43d923beb2bf5400009bad5e",
  },
  franchise: "Atlantis",
  fullName: "Milo Thatch - Spirited Scholar",
  id: "1cr",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Milo Thatch",
  set: "003",
  strength: 2,
  text: "I'M YOUR MAN! While this character is at a location, he gets +2 {S}.",
  version: "Spirited Scholar",
  willpower: 2,
};
