import type { CharacterCard } from "@tcg/lorcana-types";

export const winnieThePoohHunnyPirate: CharacterCard = {
  id: "1v3",
  cardType: "character",
  name: "Winnie the Pooh",
  version: "Hunny Pirate",
  fullName: "Winnie the Pooh - Hunny Pirate",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "006",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\n\nWE'RE PIRATES, YOU SEE Whenever this character quests, you pay 1 {I} less for the next Pirate character you play this turn.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 3,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f4cb028f3925f704d8e509b9f824df90e1dfdf0e",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Pirate"],
};
