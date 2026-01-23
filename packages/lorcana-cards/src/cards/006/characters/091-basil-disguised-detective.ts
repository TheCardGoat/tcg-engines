import type { CharacterCard } from "@tcg/lorcana-types";

export const basilDisguisedDetective: CharacterCard = {
  id: "fop",
  cardType: "character",
  name: "Basil",
  version: "Disguised Detective",
  fullName: "Basil - Disguised Detective",
  inkType: ["emerald"],
  franchise: "Great Mouse Detective",
  set: "006",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Basil.)\nTWISTS AND TURNS During your turn, whenever a card is put into your inkwell, you may pay 1 {I} to have chosen opponent choose and discard a card.",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 91,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3888d0922245bc3a1bdc014b65a50848f7973819",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Detective"],
};
