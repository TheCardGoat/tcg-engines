import type { CharacterCard } from "@tcg/lorcana-types";

export const fidgetSneakyBat: CharacterCard = {
  id: "1lo",
  cardType: "character",
  name: "Fidget",
  version: "Sneaky Bat",
  fullName: "Fidget - Sneaky Bat",
  inkType: ["emerald", "ruby"],
  franchise: "Great Mouse Detective",
  set: "007",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nI TOOK CARE OF EVERYTHING Whenever this character quests, another chosen character of yours gains Evasive until the start of your next turn.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 106,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cfdd9e04d6917aac14c9f8b2e100a587bf16ce09",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};
