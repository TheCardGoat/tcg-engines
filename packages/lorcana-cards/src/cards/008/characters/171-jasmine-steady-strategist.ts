import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineSteadyStrategist: CharacterCard = {
  id: "13i",
  cardType: "character",
  name: "Jasmine",
  version: "Steady Strategist",
  fullName: "Jasmine - Steady Strategist",
  inkType: ["sapphire", "steel"],
  franchise: "Aladdin",
  set: "008",
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Jasmine.)\nALWAYS PLANNING Whenever this character quests, look at the top 3 cards of your deck. You may reveal an Ally character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  cardNumber: 171,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8e61e3ca51b3ebb4328a02e52cc3c45757b3e641",
  },
  abilities: [
    {
      id: "13i-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 2,
      },
      text: "Shift 2",
    },
    {
      id: "13i-2",
      type: "triggered",
      name: "ALWAYS PLANNING",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      text: "ALWAYS PLANNING Whenever this character quests, look at the top 3 cards of your deck. You may reveal an Ally character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
};
