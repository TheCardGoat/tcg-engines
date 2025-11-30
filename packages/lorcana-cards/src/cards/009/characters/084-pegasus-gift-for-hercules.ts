import type { CharacterCard } from "@tcg/lorcana";

export const pegasusGiftForHercules: CharacterCard = {
  id: "1fc",
  cardType: "character",
  name: "Pegasus",
  version: "Gift for Hercules",
  fullName: "Pegasus - Gift for Hercules",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "009",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cardNumber: "084",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "b9041d1ca62abbd3a21d0c6f7bf65471865b0da4",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "1fca1",
      text: "Evasive",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
