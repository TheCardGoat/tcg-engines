import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarDreadnought: CharacterCard = {
  id: "22g",
  cardType: "character",
  name: "Jafar",
  version: "Dreadnought",
  fullName: "Jafar - Dreadnought",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "002",
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Jafar.)\nNOW WHERE WERE WE? During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 183,
  inkable: true,
  externalIds: {
    ravensburger: "077493459c0e7e98dc94b63ce4fbe302e7b7ce6f",
  },
  abilities: [
    {
      id: "22g-1",
      text: "Shift",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 2,
      },
    },
    {
      id: "22g-2",
      name: "NOW WHERE WERE WE?",
      type: "triggered",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "OPPONENT_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Floodborn", "Villain", "Sorcerer"],
};
