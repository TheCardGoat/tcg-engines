import type { CharacterCard } from "@tcg/lorcana-types";

export const rapunzelReadyForAdventure: CharacterCard = {
  abilities: [
    {
      id: "1fr-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
  ],
  cardNumber: 3,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Princess"],
  cost: 2,
  externalIds: {
    ravensburger: "ba860f11c194f1fce5cdd72524d3f7e5091ab053",
  },
  franchise: "Tangled",
  fullName: "Rapunzel - Ready for Adventure",
  id: "1fr",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingImplementation: true,
  missingTests: true,
  name: "Rapunzel",
  set: "010",
  strength: 1,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nACT OF KINDNESS Whenever one of your characters is chosen for Support, until the start of your next turn, the next time they would be dealt damage they take no damage instead.",
  version: "Ready for Adventure",
  willpower: 2,
};
