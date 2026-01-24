import type { CharacterCard } from "@tcg/lorcana-types";

export const faZhouWarHero: CharacterCard = {
  id: "1i5",
  cardType: "character",
  name: "Fa Zhou",
  version: "War Hero",
  fullName: "Fa Zhou - War Hero",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "007",
  text: "TRAINING EXERCISES Whenever one of your characters challenges another character, if it's the second challenge this turn, gain 3 lore.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 188,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0569382cc56b9650bdb6db49b16d08e519dba845",
  },
  abilities: [
    {
      id: "1i5-1",
      type: "triggered",
      name: "TRAINING EXERCISES",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "it's the second challenge this turn",
        },
        then: {
          type: "gain-lore",
          amount: 3,
        },
      },
      text: "TRAINING EXERCISES Whenever one of your characters challenges another character, if it's the second challenge this turn, gain 3 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
