import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarDreadnought: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 2,
      },
      id: "22g-1",
      keyword: "Shift",
      text: "Shift 2",
      type: "keyword",
    },
    {
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      id: "22g-2",
      name: "NOW WHERE WERE WE?",
      text: "NOW WHERE WERE WE? During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "OPPONENT_CHARACTERS",
      },
      type: "triggered",
    },
  ],
  cardNumber: 183,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "Sorcerer"],
  cost: 4,
  externalIds: {
    ravensburger: "077493459c0e7e98dc94b63ce4fbe302e7b7ce6f",
  },
  franchise: "Aladdin",
  fullName: "Jafar - Dreadnought",
  id: "22g",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  name: "Jafar",
  set: "002",
  strength: 3,
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Jafar.)\nNOW WHERE WERE WE? During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
  version: "Dreadnought",
  willpower: 4,
};
