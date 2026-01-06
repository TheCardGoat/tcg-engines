import type { CharacterCard } from "@tcg/lorcana-types";

export const arielEtherealVoice: CharacterCard = {
  id: "1l1",
  cardType: "character",
  name: "Ariel",
  version: "Ethereal Voice",
  fullName: "Ariel - Ethereal Voice",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "010",
  text: "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nCOMMAND PERFORMANCE Once during your turn, whenever you play a song, if there's a card under this character, you may draw a card.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 17,
  inkable: true,
  externalIds: {
    ravensburger: "cd8ec756a1d52021ef7131d477838312140c645d",
  },
  abilities: [
    {
      id: "1l1-1",
      type: "keyword",
      keyword: "Boost",
      value: 1,
      text: "Boost 1 {I}",
    },
    {
      id: "1l1-2",
      type: "triggered",
      name: "COMMAND PERFORMANCE Once",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "there's a card under this character",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
      text: "COMMAND PERFORMANCE Once during your turn, whenever you play a song, if there's a card under this character, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess", "Whisper"],
};
