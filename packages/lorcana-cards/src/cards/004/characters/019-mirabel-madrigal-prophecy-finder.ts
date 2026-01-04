import type { CharacterCard } from "@tcg/lorcana-types";

export const mirabelMadrigalProphecyFinder: CharacterCard = {
  id: "1lv",
  cardType: "character",
  name: "Mirabel Madrigal",
  version: "Prophecy Finder",
  fullName: "Mirabel Madrigal - Prophecy Finder",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "004",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 19,
  inkable: true,
  externalIds: {
    ravensburger: "d093d99a5578a883cc8f720171886790e355e192",
  },
  abilities: [
    {
      id: "1lv-1",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Storyborn", "Hero", "Madrigal"],
};
