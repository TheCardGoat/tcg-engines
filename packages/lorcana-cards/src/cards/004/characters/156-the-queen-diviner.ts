import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenDiviner: CharacterCard = {
  id: "aeu",
  cardType: "character",
  name: "The Queen",
  version: "Diviner",
  fullName: "The Queen - Diviner",
  inkType: ["sapphire"],
  franchise: "Snow White",
  set: "004",
  text: "CONSULT THE SPELLBOOK {E} — Look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. If that item costs 3 or less, you may play it for free instead and it enters play exerted. Put the rest on the bottom of your deck in any order.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 156,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "25872e2f6a7538f1bad704261005852bd2804752",
  },
  abilities: [],
  classifications: ["Dreamborn", "Villain", "Queen", "Sorcerer"],
};
