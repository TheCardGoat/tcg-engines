import type { CharacterCard } from "@tcg/lorcana-types";

export const beastAggressiveLord: CharacterCard = {
  id: "6u1",
  cardType: "character",
  name: "Beast",
  version: "Aggressive Lord",
  fullName: "Beast - Aggressive Lord",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "010",
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nTHAT'S MINE Whenever he challenges another character, if there's a card under this character, each opponent loses 1 lore and you gain 1 lore.",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 113,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "18a1f83e8dd250ea4790520b1f94314ac9a942dd",
  },
  abilities: [
    {
      id: "6u1-1",
      type: "keyword",
      keyword: "Boost",
      value: 2,
      text: "Boost 2 {I}",
    },
    {
      id: "6u1-2",
      type: "triggered",
      name: "THAT'S MINE",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "there's a card under this character",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
      },
      text: "THAT'S MINE Whenever he challenges another character, if there's a card under this character, each opponent loses 1 lore and you gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince", "Whisper"],
};
