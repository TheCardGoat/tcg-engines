import type { CharacterCard } from "@tcg/lorcana";

export const peterPanNeverLanding: CharacterCard = {
  id: "1g6",
  cardType: "character",
  name: "Peter Pan",
  version: "Never Landing",
  fullName: "Peter Pan - Never Landing",
  inkType: ["emerald"],
  franchise: "Peter Pan",
  set: "001",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 91,
  inkable: true,
  externalIds: {
    ravensburger: "bdb08565784cd7012548f33dfb41c5f27b8bf8f7",
  },
  abilities: [
    {
      id: "1g6-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
