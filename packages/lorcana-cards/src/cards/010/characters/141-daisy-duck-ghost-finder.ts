import type { CharacterCard } from "@tcg/lorcana-types";

export const daisyDuckGhostFinder: CharacterCard = {
  abilities: [
    {
      id: "1m1-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
  ],
  cardNumber: 141,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Detective"],
  cost: 2,
  externalIds: {
    ravensburger: "d3e63fe9f4bd72e82b947dcc61d0f2c1744b9221",
  },
  fullName: "Daisy Duck - Ghost Finder",
  id: "1m1",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  name: "Daisy Duck",
  set: "010",
  strength: 2,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  version: "Ghost Finder",
  willpower: 3,
};
