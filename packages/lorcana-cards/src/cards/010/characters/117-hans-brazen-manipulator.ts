import type { CharacterCard } from "@tcg/lorcana-types";

export const hansBrazenManipulator: CharacterCard = {
  abilities: [
    {
      effect: {
        restriction: "cant-quest",
        target: "SELF",
        type: "restriction",
      },
      id: "bkr-1",
      text: "JOSTLING FOR POWER King and Queen characters can't quest.",
      type: "action",
    },
    {
      effect: {
        condition: {
          type: "if",
          expression: "an opponent has 2 or more ready characters in play",
        },
        then: {
          type: "gain-lore",
          amount: 2,
        },
        type: "conditional",
      },
      id: "bkr-2",
      text: "GROWING INFLUENCE At the start of your turn, if an opponent has 2 or more ready characters in play, gain 2 lore.",
      type: "action",
    },
  ],
  cardNumber: 117,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Prince"],
  cost: 6,
  externalIds: {
    ravensburger: "29b94bb0bba4c19bd7f17b07feb835bdef4029ef",
  },
  franchise: "Frozen",
  fullName: "Hans - Brazen Manipulator",
  id: "bkr",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Hans",
  set: "010",
  strength: 6,
  text: "JOSTLING FOR POWER King and Queen characters can't quest.\nGROWING INFLUENCE At the start of your turn, if an opponent has 2 or more ready characters in play, gain 2 lore.",
  version: "Brazen Manipulator",
  willpower: 4,
};
