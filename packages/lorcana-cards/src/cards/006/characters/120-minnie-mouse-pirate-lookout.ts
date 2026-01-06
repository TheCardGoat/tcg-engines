import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMousePirateLookout: CharacterCard = {
  id: "1hl",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Pirate Lookout",
  fullName: "Minnie Mouse - Pirate Lookout",
  inkType: ["ruby"],
  set: "006",
  text: "LAND, HO! Once during your turn, whenever a card is put into your inkwell, you may return a location card from your discard to your hand.",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 120,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c1342a66787eb3f74ae51488e7b16a4ad1776975",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Pirate"],
};
