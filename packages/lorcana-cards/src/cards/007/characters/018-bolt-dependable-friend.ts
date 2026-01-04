import type { CharacterCard } from "@tcg/lorcana-types";

export const boltDependableFriend: CharacterCard = {
  id: "j9c",
  cardType: "character",
  name: "Bolt",
  version: "Dependable Friend",
  fullName: "Bolt - Dependable Friend",
  inkType: ["amber"],
  franchise: "Bolt",
  set: "007",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 18,
  inkable: true,
  externalIds: {
    ravensburger: "4569c6b9d1aa773811189e4fe7746e13a5b67569",
  },
  abilities: [
    {
      id: "j9c-1",
      text: "Support",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
