import type { CharacterCard } from "@tcg/lorcana-types";

export const kakamoraPirateChief: CharacterCard = {
  id: "15x",
  cardType: "character",
  name: "Kakamora",
  version: "Pirate Chief",
  fullName: "Kakamora - Pirate Chief",
  inkType: ["steel"],
  franchise: "Moana",
  set: "006",
  text: "COCONUT LEADER Whenever this character quests, you may draw a card. Then, choose and discard a card to deal 1 damage to chosen character or location. If a Pirate character card was discarded, deal 3 damage to that character or location instead.",
  cost: 7,
  strength: 4,
  willpower: 6,
  lore: 2,
  cardNumber: 172,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "97266efddadb85c14ed91903802d893795b7d75a",
  },
  abilities: [],
  classifications: ["Storyborn", "Pirate", "Captain"],
};
