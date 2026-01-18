import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMousePirateCaptain: CharacterCard = {
  id: "adf",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Pirate Captain",
  fullName: "Mickey Mouse - Pirate Captain",
  inkType: ["ruby"],
  set: "006",
  text: 'Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Mickey Mouse.)\nMARINER’S MIGHT Whenever this character quests, chosen Pirate character gets +2 {S} and gains "This character takes no damage from challenges" this turn.',
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 103,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "25626315d5e1fbf223d3c10f20336b464a7a2e7e",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Pirate", "Captain"],
};
