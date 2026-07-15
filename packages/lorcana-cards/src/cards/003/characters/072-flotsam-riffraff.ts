import type { CharacterCard } from "@tcg/lorcana-types";

export const flotsamRiffraff: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 3,
        stat: "strength",
        target: "YOUR_CHARACTERS",
        type: "modify-stat",
      },
      id: "c4r-1",
      text: "EERIE PAIR Your characters named Jetsam get +3 {S}.",
      type: "action",
    },
  ],
  cardNumber: 72,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "2bb99c6ebaa84faa87f503ede5ffc12cd846451b",
  },
  franchise: "Little Mermaid",
  fullName: "Flotsam - Riffraff",
  id: "c4r",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Flotsam",
  set: "003",
  strength: 5,
  text: "EERIE PAIR Your characters named Jetsam get +3 {S}.",
  version: "Riffraff",
  willpower: 2,
};
