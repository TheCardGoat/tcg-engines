import type { CharacterCard } from "@tcg/lorcana-types";

export const simbaKingInTheMaking: CharacterCard = {
  id: "dbt",
  cardType: "character",
  name: "Simba",
  version: "King in the Making",
  fullName: "Simba - King in the Making",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "010",
  text: "Boost 3 {I} (Once during your turn, you may pay 3 {I} to put the top card of your deck facedown under this character.)\nTIMELY ALLIANCE Whenever you put a card under this character, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the bottom of your deck.",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 3,
  cardNumber: 20,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "300970a7922a3db43c3c7f144ac6eb41c50cc42b",
  },
  abilities: [
    {
      id: "dbt-1",
      type: "keyword",
      keyword: "Boost",
      value: 3,
      text: "Boost 3 {I}",
    },
    {
      id: "dbt-2",
      type: "triggered",
      name: "TIMELY ALLIANCE",
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
      text: "TIMELY ALLIANCE Whenever you put a card under this character, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the bottom of your deck.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince", "Whisper"],
};
