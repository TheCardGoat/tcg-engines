import type { CharacterCard } from "@tcg/lorcana-types";

export const daisyDuckMultitalentedPirate: CharacterCard = {
  id: "1o7",
  cardType: "character",
  name: "Daisy Duck",
  version: "Multitalented Pirate",
  fullName: "Daisy Duck - Multitalented Pirate",
  inkType: ["emerald"],
  set: "007",
  text: "FOWL PLAY Once during your turn, whenever a card is put into your inkwell, chosen opponent chooses one of their characters and returns that card to their hand.",
  cost: 8,
  strength: 6,
  willpower: 5,
  lore: 3,
  cardNumber: 108,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d8f343ee238be3a7ebf0f0a9f5f2a7b707f21cdf",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Pirate", "Captain"],
};
