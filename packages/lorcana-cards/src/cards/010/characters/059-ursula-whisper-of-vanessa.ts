import type { CharacterCard } from "@tcg/lorcana-types";

export const ursulaWhisperOfVanessa: CharacterCard = {
  id: "86p",
  cardType: "character",
  name: "Ursula",
  version: "Whisper of Vanessa",
  fullName: "Ursula - Whisper of Vanessa",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "010",
  text: "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nSLIPPERY SPELL While there's a card under this character, she gets +1 {L} and gains Evasive. (Only characters with Evasive can challenge them.)",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 59,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1d80b7ef4fbf39b61830fba896f5c20514ed5e87",
  },
  abilities: [
    {
      id: "86p-1",
      type: "keyword",
      keyword: "Boost",
      value: 1,
      text: "Boost 1 {I}",
    },
    {
      id: "86p-2",
      type: "static",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "lore",
            modifier: 1,
            target: "SELF",
          },
          {
            type: "gain-keyword",
            keyword: "Evasive",
            target: "SELF",
          },
        ],
      },
      text: "SLIPPERY SPELL While there's a card under this character, she gets +1 {L} and gains Evasive.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer", "Whisper"],
};
