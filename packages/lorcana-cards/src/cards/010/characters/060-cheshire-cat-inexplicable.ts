import type { CharacterCard } from "@tcg/lorcana-types";

export const cheshireCatInexplicable: CharacterCard = {
  abilities: [
    {
      id: "u5d-1",
      keyword: "Boost",
      text: "Boost 2 {I}",
      type: "keyword",
      value: 2,
    },
  ],
  cardNumber: 60,
  cardType: "character",
  classifications: ["Storyborn", "Whisper"],
  cost: 3,
  externalIds: {
    ravensburger: "6ca8fed019555f17fff25a67cb189d3e060bdfc9",
  },
  franchise: "Alice in Wonderland",
  fullName: "Cheshire Cat - Inexplicable",
  id: "u5d",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingImplementation: true,
  missingTests: true,
  name: "Cheshire Cat",
  set: "010",
  strength: 3,
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nIT'S LOADS OF FUN Whenever you put a card under this character, you may move up to 2 damage counters from chosen character to chosen opposing character.",
  version: "Inexplicable",
  willpower: 4,
};
