import type { CharacterCard } from "@tcg/lorcana-types";

export const brutusFearsomeCrocodile: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "one of your characters was damaged this turn",
        },
        then: {
          type: "gain-lore",
          amount: 2,
        },
      },
      id: "j0c-1",
      name: "SPITEFUL",
      text: "SPITEFUL During your turn, when this character is banished, if one of your characters was damaged this turn, gain 2 lore.",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 125,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "01e730b5e5ab7138fbadd2610b5ad30a92c6e5e5",
  },
  franchise: "Rescuers",
  fullName: "Brutus - Fearsome Crocodile",
  id: "j0c",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Brutus",
  set: "008",
  strength: 4,
  text: "SPITEFUL During your turn, when this character is banished, if one of your characters was damaged this turn, gain 2 lore.",
  version: "Fearsome Crocodile",
  willpower: 3,
};
