import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseStylishSurfer: CharacterCard = {
  id: "1yy",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Stylish Surfer",
  fullName: "Minnie Mouse - Stylish Surfer",
  inkType: ["ruby"],
  set: "002",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  cardNumber: 113,
  inkable: true,
  externalIds: {
    ravensburger: "ffbe9beca8f3ff3eb0301baf5d2fe237571c4099",
  },
  abilities: [
    {
      id: "1yy-1",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
