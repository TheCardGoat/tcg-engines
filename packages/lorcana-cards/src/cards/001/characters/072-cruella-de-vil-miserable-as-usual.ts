import type { CharacterCard } from "@tcg/lorcana-types";

export const cruellaDeVilmiserableAsUsual: CharacterCard = {
  id: "cw0",
  cardType: "character",
  name: "Cruella De Vil",
  version: "Miserable as Usual",
  fullName: "Cruella De Vil - Miserable as Usual",
  inkType: ["emerald"],
  franchise: "101 Dalmatians",
  set: "001",
  text: "YOU'LL BE SORRY! When this character is challenged and banished, you may return chosen character to their player's hand.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 72,
  inkable: true,
  externalIds: {
    ravensburger: "2e73f0957919d8b91e9c5a66b5c0b5a5ede4afeb",
  },
  abilities: [
    {
      id: "cw0-1",
      text: "YOU'LL BE SORRY! When this character is challenged and banished, you may return chosen character to their player's hand.",
      name: "YOU'LL BE SORRY!",
      type: "triggered",
      trigger: {
        event: "challenged",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
