import type { CharacterCard } from "@tcg/lorcana-types";

export const peterPanPiratesBane: CharacterCard = {
  id: "uwt",
  cardType: "character",
  name: "Peter Pan",
  version: "Pirate's Bane",
  fullName: "Peter Pan - Pirate's Bane",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "003",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Peter Pan.)\nEvasive (Only characters with Evasive can challenge this character.)\nYOU'RE NEXT! Whenever he challenges a Pirate character, this character takes no damage from the challenge.",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 120,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6f685f0a2a2fbce4b5ece504fc70f70dc4bae551",
  },
  abilities: [
    {
      id: "uwt-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4",
    },
    {
      id: "uwt-2",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Floodborn", "Hero"],
};
