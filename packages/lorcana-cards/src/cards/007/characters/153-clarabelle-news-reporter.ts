import type { CharacterCard } from "@tcg/lorcana-types";

export const clarabelleNewsReporter: CharacterCard = {
  abilities: [
    {
      id: "1r6-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "YOUR_CHARACTERS",
        type: "modify-stat",
      },
      id: "1r6-2",
      text: "BREAKING STORY Your other characters with Support get +1 {S}.",
      type: "action",
    },
  ],
  cardNumber: 153,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "e3b5dbe6ce01c2ada369d0b5792e10567e35497f",
  },
  fullName: "Clarabelle - News Reporter",
  id: "1r6",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Clarabelle",
  set: "007",
  strength: 3,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nBREAKING STORY Your other characters with Support get +1 {S}.",
  version: "News Reporter",
  willpower: 3,
};
