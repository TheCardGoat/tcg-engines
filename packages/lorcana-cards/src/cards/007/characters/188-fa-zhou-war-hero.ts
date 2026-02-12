import type { CharacterCard } from "@tcg/lorcana-types";

export const faZhouWarHero: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "it's the second challenge this turn",
          type: "if",
        },
        then: {
          amount: 3,
          type: "gain-lore",
        },
        type: "conditional",
      },
      id: "1i5-1",
      name: "TRAINING EXERCISES",
      text: "TRAINING EXERCISES Whenever one of your characters challenges another character, if it's the second challenge this turn, gain 3 lore.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 188,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "0569382cc56b9650bdb6db49b16d08e519dba845",
  },
  franchise: "Mulan",
  fullName: "Fa Zhou - War Hero",
  id: "1i5",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Fa Zhou",
  set: "007",
  strength: 2,
  text: "TRAINING EXERCISES Whenever one of your characters challenges another character, if it's the second challenge this turn, gain 3 lore.",
  version: "War Hero",
  willpower: 3,
};
