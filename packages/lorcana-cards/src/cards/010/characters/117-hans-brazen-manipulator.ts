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
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "29b94bb0bba4c19bd7f17b07feb835bdef4029ef",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Prince"],
};
