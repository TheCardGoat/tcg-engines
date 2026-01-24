import type { CharacterCard } from "@tcg/lorcana-types";

export const cheshireCatInexplicable: CharacterCard = {
  id: "u5d",
  cardType: "character",
  name: "Cheshire Cat",
  version: "Inexplicable",
  fullName: "Cheshire Cat - Inexplicable",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "010",
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nIT'S LOADS OF FUN Whenever you put a card under this character, you may move up to 2 damage counters from chosen character to chosen opposing character.",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 60,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6ca8fed019555f17fff25a67cb189d3e060bdfc9",
  },
  abilities: [
    {
      id: "u5d-1",
      type: "keyword",
      keyword: "Boost",
      value: 2,
      text: "Boost 2 {I}",
    },
  ],
  classifications: ["Storyborn", "Whisper"],
};
