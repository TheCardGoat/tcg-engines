import type { CharacterCard } from "@tcg/lorcana-types";

export const fixitFelixJrDelightedSightseer: CharacterCard = {
  id: "108",
  cardType: "character",
  name: "Fix-It Felix, Jr.",
  version: "Delighted Sightseer",
  fullName: "Fix-It Felix, Jr. - Delighted Sightseer",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "005",
  text: "OH, MY LAND! When you play this character, if you have a location in play, draw a card.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 17,
  inkable: true,
  externalIds: {
    ravensburger: "8554dd289e793c516ccdb856fac99c52a61d5c69",
  },
  abilities: [
    {
      id: "108-1",
      text: "OH, MY LAND! When you play this character, if you have a location in play, draw a card.",
      name: "OH, MY LAND!",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
