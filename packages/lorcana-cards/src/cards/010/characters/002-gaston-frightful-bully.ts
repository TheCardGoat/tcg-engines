import type { CharacterCard } from "@tcg/lorcana-types";

export const gastonFrightfulBully: CharacterCard = {
  abilities: [
    {
      id: "14y-1",
      keyword: "Boost",
      text: "Boost 2 {I}",
      type: "keyword",
      value: 2,
    },
    {
      effect: {
        condition: {
          expression: "there's a card under him",
          type: "if",
        },
        then: {
          restriction: "cant-challenge",
          target: "SELF",
          type: "restriction",
        },
        type: "conditional",
      },
      id: "14y-2",
      name: "TOP THAT!",
      text: "TOP THAT! Whenever this character quests, if there's a card under him, chosen opposing character can't challenge and must quest if able during their next turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 2,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Whisper"],
  cost: 2,
  externalIds: {
    ravensburger: "93a1e91ad769dd24d137c4b39540e3d3e8e6c5bc",
  },
  franchise: "Beauty and the Beast",
  fullName: "Gaston - Frightful Bully",
  id: "14y",
  inkType: ["amber"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Gaston",
  set: "010",
  strength: 3,
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nTOP THAT! Whenever this character quests, if there's a card under him, chosen opposing character can't challenge and must quest if able during their next turn.",
  version: "Frightful Bully",
  willpower: 3,
};
