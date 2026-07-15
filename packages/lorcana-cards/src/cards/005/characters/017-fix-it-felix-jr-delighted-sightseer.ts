import type { CharacterCard } from "@tcg/lorcana-types";

export const fixitFelixJrDelightedSightseer: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "you have a location in play",
          type: "if",
        },
        then: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "conditional",
      },
      id: "108-1",
      text: "OH, MY LAND! When you play this character, if you have a location in play, draw a card.",
      type: "action",
    },
  ],
  cardNumber: 17,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 2,
  externalIds: {
    ravensburger: "8554dd289e793c516ccdb856fac99c52a61d5c69",
  },
  franchise: "Wreck It Ralph",
  fullName: "Fix-It Felix, Jr. - Delighted Sightseer",
  id: "108",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  name: "Fix-It Felix, Jr.",
  set: "005",
  strength: 1,
  text: "OH, MY LAND! When you play this character, if you have a location in play, draw a card.",
  version: "Delighted Sightseer",
  willpower: 3,
};
