import type { CharacterCard } from "@tcg/lorcana-types";

export const beastAggressiveLord: CharacterCard = {
  abilities: [
    {
      id: "6u1-1",
      keyword: "Boost",
      text: "Boost 2 {I}",
      type: "keyword",
      value: 2,
    },
    {
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
      id: "6u1-2",
      name: "THAT'S MINE",
      text: "THAT'S MINE Whenever he challenges another character, if there's a card under this character, each opponent loses 1 lore and you gain 1 lore.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 113,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Prince", "Whisper"],
  cost: 2,
  externalIds: {
    ravensburger: "18a1f83e8dd250ea4790520b1f94314ac9a942dd",
  },
  franchise: "Beauty and the Beast",
  fullName: "Beast - Aggressive Lord",
  id: "6u1",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Beast",
  set: "010",
  strength: 3,
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nTHAT'S MINE Whenever he challenges another character, if there's a card under this character, each opponent loses 1 lore and you gain 1 lore.",
  version: "Aggressive Lord",
  willpower: 2,
};
