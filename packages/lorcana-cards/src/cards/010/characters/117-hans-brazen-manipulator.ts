import type { CharacterCard } from "@tcg/lorcana-types";

export const hansBrazenManipulator: CharacterCard = {
  id: "bkr",
  cardType: "character",
  name: "Hans",
  version: "Brazen Manipulator",
  fullName: "Hans - Brazen Manipulator",
  inkType: ["ruby"],
  franchise: "Frozen",
  set: "010",
  text: "JOSTLING FOR POWER King and Queen characters can't quest.\nGROWING INFLUENCE At the start of your turn, if an opponent has 2 or more ready characters in play, gain 2 lore.",
  cost: 6,
  strength: 6,
  willpower: 4,
  lore: 2,
  cardNumber: 117,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "29b94bb0bba4c19bd7f17b07feb835bdef4029ef",
  },
  abilities: [
    {
      id: "bkr-1",
      type: "action",
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
      },
      text: "JOSTLING FOR POWER King and Queen characters can't quest.",
    },
    {
      id: "bkr-2",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "an opponent has 2 or more ready characters in play",
        },
        then: {
          type: "gain-lore",
          amount: 2,
        },
      },
      text: "GROWING INFLUENCE At the start of your turn, if an opponent has 2 or more ready characters in play, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Prince"],
};
