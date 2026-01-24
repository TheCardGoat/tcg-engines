import type { CharacterCard } from "@tcg/lorcana-types";

export const flotsamRiffraff: CharacterCard = {
  id: "c4r",
  cardType: "character",
  name: "Flotsam",
  version: "Riffraff",
  fullName: "Flotsam - Riffraff",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "003",
  text: "EERIE PAIR Your characters named Jetsam get +3 {S}.",
  cost: 3,
  strength: 5,
  willpower: 2,
  lore: 1,
  cardNumber: 72,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2bb99c6ebaa84faa87f503ede5ffc12cd846451b",
  },
  abilities: [
    {
      id: "c4r-1",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        target: "YOUR_CHARACTERS",
      },
      text: "EERIE PAIR Your characters named Jetsam get +3 {S}.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
