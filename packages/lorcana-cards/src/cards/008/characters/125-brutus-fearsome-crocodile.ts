import type { CharacterCard } from "@tcg/lorcana-types";

export const brutusFearsomeCrocodile: CharacterCard = {
  id: "j0c",
  cardType: "character",
  name: "Brutus",
  version: "Fearsome Crocodile",
  fullName: "Brutus - Fearsome Crocodile",
  inkType: ["ruby"],
  franchise: "Rescuers",
  set: "008",
  text: "SPITEFUL During your turn, when this character is banished, if one of your characters was damaged this turn, gain 2 lore.",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 125,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "01e730b5e5ab7138fbadd2610b5ad30a92c6e5e5",
  },
  abilities: [
    {
      id: "j0c-1",
      type: "triggered",
      name: "SPITEFUL",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
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
      text: "SPITEFUL During your turn, when this character is banished, if one of your characters was damaged this turn, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
