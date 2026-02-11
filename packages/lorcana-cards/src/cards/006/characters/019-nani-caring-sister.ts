import type { CharacterCard } from "@tcg/lorcana-types";

export const naniCaringSister: CharacterCard = {
  abilities: [
    {
      id: "1fu-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      id: "1fu-2",
      text: "I AM SO SORRY 2 {I} - Chosen character gets -1 {S} until the start of your next turn.",
      type: "action",
    },
  ],
  cardNumber: 19,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 5,
  externalIds: {
    ravensburger: "badb6313c16d779154ca8614bade62b8ebaaafee",
  },
  franchise: "Lilo and Stitch",
  fullName: "Nani - Caring Sister",
  id: "1fu",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Nani",
  set: "006",
  strength: 3,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)\nI AM SO SORRY 2 {I} - Chosen character gets -1 {S} until the start of your next turn.",
  version: "Caring Sister",
  willpower: 5,
};
