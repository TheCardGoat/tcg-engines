import type { CharacterCard } from "@tcg/lorcana-types";

export const clarabelleNewsReporter: CharacterCard = {
  id: "1r6",
  cardType: "character",
  name: "Clarabelle",
  version: "News Reporter",
  fullName: "Clarabelle - News Reporter",
  inkType: ["sapphire"],
  set: "007",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nBREAKING STORY Your other characters with Support get +1 {S}.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 153,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e3b5dbe6ce01c2ada369d0b5792e10567e35497f",
  },
  abilities: [
    {
      id: "1r6-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
    {
      id: "1r6-2",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_CHARACTERS",
      },
      text: "BREAKING STORY Your other characters with Support get +1 {S}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
