import type { CharacterCard } from "@tcg/lorcana-types";

export const peterPanPiratesBane: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "uwt-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
    {
      id: "uwt-2",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
  cardNumber: 120,
  cardType: "character",
  classifications: ["Floodborn", "Hero"],
  cost: 6,
  externalIds: {
    ravensburger: "6f685f0a2a2fbce4b5ece504fc70f70dc4bae551",
  },
  franchise: "Peter Pan",
  fullName: "Peter Pan - Pirate's Bane",
  id: "uwt",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Peter Pan",
  set: "003",
  strength: 4,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Peter Pan.)\nEvasive (Only characters with Evasive can challenge this character.)\nYOU'RE NEXT! Whenever he challenges a Pirate character, this character takes no damage from the challenge.",
  version: "Pirate's Bane",
  willpower: 5,
};
