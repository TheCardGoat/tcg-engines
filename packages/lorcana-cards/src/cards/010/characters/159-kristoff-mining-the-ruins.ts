import type { CharacterCard } from "@tcg/lorcana-types";

export const kristoffMiningTheRuins: CharacterCard = {
  abilities: [
    {
      id: "abh-1",
      keyword: "Boost",
      text: "Boost 1 {I}",
      type: "keyword",
      value: 1,
    },
    {
      effect: {
        condition: {
          expression: "there's a card under him",
          type: "if",
        },
        then: {
          exerted: true,
          facedown: true,
          source: "top-of-deck",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "conditional",
      },
      id: "abh-2",
      name: "WORTH MINING",
      text: "WORTH MINING Whenever this character quests, if there's a card under him, put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 159,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Whisper"],
  cost: 3,
  externalIds: {
    ravensburger: "25306da70d3153e36ca5d991f62a889aab375668",
  },
  franchise: "Frozen",
  fullName: "Kristoff - Mining the Ruins",
  id: "abh",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Kristoff",
  set: "010",
  strength: 2,
  text: "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nWORTH MINING Whenever this character quests, if there's a card under him, put the top card of your deck into your inkwell facedown and exerted.",
  version: "Mining the Ruins",
  willpower: 3,
};
