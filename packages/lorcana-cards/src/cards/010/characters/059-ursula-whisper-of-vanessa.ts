import type { CharacterCard } from "@tcg/lorcana-types";

export const ursulaWhisperOfVanessa: CharacterCard = {
  abilities: [
    {
      id: "86p-1",
      keyword: "Boost",
      text: "Boost 1 {I}",
      type: "keyword",
      value: 1,
    },
    {
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
      id: "86p-2",
      text: "SLIPPERY SPELL While there's a card under this character, she gets +1 {L} and gains Evasive.",
      type: "static",
    },
  ],
  cardNumber: 59,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Sorcerer", "Whisper"],
  cost: 5,
  externalIds: {
    ravensburger: "1d80b7ef4fbf39b61830fba896f5c20514ed5e87",
  },
  franchise: "Little Mermaid",
  fullName: "Ursula - Whisper of Vanessa",
  id: "86p",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Ursula",
  set: "010",
  strength: 4,
  text: "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nSLIPPERY SPELL While there's a card under this character, she gets +1 {L} and gains Evasive. (Only characters with Evasive can challenge them.)",
  version: "Whisper of Vanessa",
  willpower: 5,
};
