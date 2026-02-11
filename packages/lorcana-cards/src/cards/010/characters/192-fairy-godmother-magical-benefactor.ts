import type { CharacterCard } from "@tcg/lorcana-types";

export const fairyGodmotherMagicalBenefactor: CharacterCard = {
  abilities: [
    {
      id: "45t-1",
      keyword: "Boost",
      text: "Boost 3 {I}",
      type: "keyword",
      value: 3,
    },
    {
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "banish",
              target: {
                selector: "chosen",
                count: 1,
                filter: [{ type: "owner", owner: "opponent" }],
              },
            },
            {
              type: "conditional",
              condition: {
                type: "if-you-do",
              },
              then: {
                type: "look-at-cards",
                amount: 1,
                source: "deck",
                target: "OPPONENT",
              },
            },
          ],
        },
      },
      id: "45t-2",
      name: "STUNNING TRANSFORMATION",
      text: "STUNNING TRANSFORMATION Whenever you put a card under this character, you may banish chosen opposing character. If you do, their player may reveal the top card of their deck. If that card is a character or item card, they may play it for free. Otherwise, they put it on the bottom of their deck.",
      trigger: {
        event: "ink",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 192,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Fairy", "Sorcerer", "Whisper"],
  cost: 4,
  externalIds: {
    ravensburger: "0eff7db7f6adc7c58c920601038ab9ee513f364f",
  },
  franchise: "Cinderella",
  fullName: "Fairy Godmother - Magical Benefactor",
  id: "45t",
  inkType: ["steel"],
  inkable: false,
  lore: 1,
  name: "Fairy Godmother",
  set: "010",
  strength: 3,
  text: "Boost 3 {I} (Once during your turn, you may pay 3 {I} to put the top card of your deck facedown under this character.)\nSTUNNING TRANSFORMATION Whenever you put a card under this character, you may banish chosen opposing character. If you do, their player may reveal the top card of their deck. If that card is a character or item card, they may play it for free. Otherwise, they put it on the bottom of their deck.",
  version: "Magical Benefactor",
  willpower: 5,
};
