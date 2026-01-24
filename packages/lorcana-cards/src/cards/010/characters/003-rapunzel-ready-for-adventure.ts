import type { CharacterCard } from "@tcg/lorcana-types";

export const rapunzelReadyForAdventure: CharacterCard = {
  id: "1fr",
  cardType: "character",
  name: "Rapunzel",
  version: "Ready for Adventure",
  fullName: "Rapunzel - Ready for Adventure",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "010",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nACT OF KINDNESS Whenever one of your characters is chosen for Support, until the start of your next turn, the next time they would be dealt damage they take no damage instead.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 3,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ba860f11c194f1fce5cdd72524d3f7e5091ab053",
  },
  abilities: [
    {
      id: "1fr-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
};
