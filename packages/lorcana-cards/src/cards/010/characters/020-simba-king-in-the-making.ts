import type { CharacterCard } from "@tcg/lorcana-types";

export const simbaKingInTheMaking: CharacterCard = {
  abilities: [
    {
      id: "dbt-1",
      keyword: "Boost",
      text: "Boost 3 {I}",
      type: "keyword",
      value: 3,
    },
    {
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "it's a character card",
        },
        then: {
          type: "restriction",
          restriction: "enters-play-exerted",
          target: "SELF",
        },
      },
      id: "dbt-2",
      name: "TIMELY ALLIANCE",
      text: "TIMELY ALLIANCE Whenever you put a card under this character, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the bottom of your deck.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 20,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Prince", "Whisper"],
  cost: 7,
  externalIds: {
    ravensburger: "300970a7922a3db43c3c7f144ac6eb41c50cc42b",
  },
  franchise: "Lion King",
  fullName: "Simba - King in the Making",
  id: "dbt",
  inkType: ["amber"],
  inkable: true,
  lore: 3,
  missingTests: true,
  name: "Simba",
  set: "010",
  strength: 5,
  text: "Boost 3 {I} (Once during your turn, you may pay 3 {I} to put the top card of your deck facedown under this character.)\nTIMELY ALLIANCE Whenever you put a card under this character, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the bottom of your deck.",
  version: "King in the Making",
  willpower: 5,
};
