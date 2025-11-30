import type { CharacterCard } from "@tcg/lorcana";

export const daisyDuckGhostFinder: CharacterCard = {
  id: "1m1",
  cardType: "character",
  name: "Daisy Duck",
  version: "Ghost Finder",
  fullName: "Daisy Duck - Ghost Finder",
  inkType: ["sapphire"],
  set: "010",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cardNumber: "141",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "d3e63fe9f4bd72e82b947dcc61d0f2c1744b9221",
  },
  keywords: ["Support"],
  abilities: [
    {
      id: "1m1-1",
      text: "Support",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
};
