import type { CharacterCard } from "@tcg/lorcana-types";

export const boltDependableFriend: CharacterCard = {
  abilities: [
    {
      id: "j9c-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
  ],
  cardNumber: 18,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "4569c6b9d1aa773811189e4fe7746e13a5b67569",
  },
  franchise: "Bolt",
  fullName: "Bolt - Dependable Friend",
  id: "j9c",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  name: "Bolt",
  set: "007",
  strength: 2,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  version: "Dependable Friend",
  willpower: 4,
};
