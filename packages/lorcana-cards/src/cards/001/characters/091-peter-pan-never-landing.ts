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
  cardNumber: "091",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "bdb08565784cd7012548f33dfb41c5f27b8bf8f7",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "1g6a1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
