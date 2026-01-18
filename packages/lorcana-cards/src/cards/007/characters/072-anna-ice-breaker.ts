import type { CharacterCard } from "@tcg/lorcana-types";

export const annaIceBreaker: CharacterCard = {
  id: "pj2",
  cardType: "character",
  name: "Anna",
  version: "Ice Breaker",
  fullName: "Anna - Ice Breaker",
  inkType: ["amethyst", "sapphire"],
  franchise: "Frozen",
  set: "007",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nWINTER AMBUSH When you play this character, chosen opposing character can't ready at the start of their next turn.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 72,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5c027c79eedd9a761d4497187cd38ba25c697de4",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Queen", "Sorcerer"],
};
