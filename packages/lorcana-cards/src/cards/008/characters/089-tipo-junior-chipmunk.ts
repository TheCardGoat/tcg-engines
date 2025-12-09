import type { CharacterCard } from "@tcg/lorcana";

export const tipoJuniorChipmunk: CharacterCard = {
  id: "y4v",
  cardType: "character",
  name: "Tipo",
  version: "Junior Chipmunk",
  fullName: "Tipo - Junior Chipmunk",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "008",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 89,
  inkable: true,
  externalIds: {
    ravensburger: "7b06c25ffca1f97366fbde4b81b28dcfbe6abcb4",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "y4v-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
