import type { CharacterCard } from "@tcg/lorcana-types";

export const arielEtherealVoice: CharacterCard = {
  abilities: [
    {
      id: "1l1-1",
      keyword: "Boost",
      text: "Boost 1 {I}",
      type: "keyword",
      value: 1,
    },
    {
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
      id: "1l1-2",
      name: "COMMAND PERFORMANCE Once",
      text: "COMMAND PERFORMANCE Once during your turn, whenever you play a song, if there's a card under this character, you may draw a card.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      type: "triggered",
    },
  ],
  cardNumber: 17,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess", "Whisper"],
  cost: 4,
  externalIds: {
    ravensburger: "cd8ec756a1d52021ef7131d477838312140c645d",
  },
  franchise: "Little Mermaid",
  fullName: "Ariel - Ethereal Voice",
  id: "1l1",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  name: "Ariel",
  set: "010",
  strength: 3,
  text: "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nCOMMAND PERFORMANCE Once during your turn, whenever you play a song, if there's a card under this character, you may draw a card.",
  version: "Ethereal Voice",
  willpower: 4,
};
