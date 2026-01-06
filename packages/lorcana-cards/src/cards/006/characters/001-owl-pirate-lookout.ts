import type { CharacterCard } from "@tcg/lorcana-types";

export const owlPirateLookout: CharacterCard = {
  id: "kq3",
  cardType: "character",
  name: "Owl",
  version: "Pirate Lookout",
  fullName: "Owl - Pirate Lookout",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "006",
  text: "WELL SPOTTED During your turn, whenever a card is put into your inkwell, chosen opposing character gets -1 {S} until the start of your next turn.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 1,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4ab1a2c7f0197a4df9d436fc82d25fb88371a3ec",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Pirate"],
};
