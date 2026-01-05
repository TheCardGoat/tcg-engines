import type { CharacterCard } from "@tcg/lorcana-types";

export const fairyGodmotherMagicalBenefactor: CharacterCard = {
  id: "45t",
  cardType: "character",
  name: "Fairy Godmother",
  version: "Magical Benefactor",
  fullName: "Fairy Godmother - Magical Benefactor",
  inkType: ["steel"],
  franchise: "Cinderella",
  set: "010",
  text: "Boost 3 {I} (Once during your turn, you may pay 3 {I} to put the top card of your deck facedown under this character.)\nSTUNNING TRANSFORMATION Whenever you put a card under this character, you may banish chosen opposing character. If you do, their player may reveal the top card of their deck. If that card is a character or item card, they may play it for free. Otherwise, they put it on the bottom of their deck.",
  cost: 4,
  strength: 3,
  willpower: 5,
  lore: 1,
  cardNumber: 192,
  inkable: false,
  externalIds: {
    ravensburger: "0eff7db7f6adc7c58c920601038ab9ee513f364f",
  },
  abilities: [
    {
      id: "45t-1",
      type: "keyword",
      keyword: "Boost",
      value: 3,
      text: "Boost 3 {I}",
    },
    {
      id: "45t-2",
      name: "STUNNING TRANSFORMATION",
      text: "Whenever you put a card under this character, you may banish chosen opposing character. If you do, their player may reveal the top card of their deck. If that card is a character or item card, they may play it for free. Otherwise, they put it on the bottom of their deck.",
      type: "triggered",
      trigger: {
        event: "ink",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "banish",
              target: {
                selector: "chosen",
                owner: "opponent",
                count: 1,
              },
            },
            {
              type: "conditional",
              condition: {
                type: "if",
                expression: "you do",
              },
              then: {
                type: "look-at-cards",
                amount: 1,
                from: "top-of-deck",
                target: "OPPONENT",
              },
            },
          ],
        },
      },
    },
  ],
  classifications: ["Storyborn", "Ally", "Fairy", "Sorcerer", "Whisper"],
};
