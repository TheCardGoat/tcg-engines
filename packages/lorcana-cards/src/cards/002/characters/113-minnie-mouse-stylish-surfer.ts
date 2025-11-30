import type { CharacterCard } from "@tcg/lorcana";

export const minnieMouseStylishSurfer: CharacterCard = {
  id: "1yy",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Stylish Surfer",
  fullName: "Minnie Mouse - Stylish Surfer",
  inkType: ["ruby"],
  set: "002",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cardNumber: "113",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "ffbe9beca8f3ff3eb0301baf5d2fe237571c4099",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "1yy-ability-1",
      text: "Evasive (Only characters with Evasive can challenge this character.)",
      type: "static",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
