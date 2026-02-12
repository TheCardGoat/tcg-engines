import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineSteadyStrategist: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 2,
      },
      id: "13i-1",
      keyword: "Shift",
      text: "Shift 2",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        type: "optional",
      },
      id: "13i-2",
      name: "ALWAYS PLANNING",
      text: "ALWAYS PLANNING Whenever this character quests, look at the top 3 cards of your deck. You may reveal an Ally character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 171,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "8e61e3ca51b3ebb4328a02e52cc3c45757b3e641",
  },
  franchise: "Aladdin",
  fullName: "Jasmine - Steady Strategist",
  id: "13i",
  inkType: ["sapphire", "steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Jasmine",
  set: "008",
  strength: 2,
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Jasmine.)\nALWAYS PLANNING Whenever this character quests, look at the top 3 cards of your deck. You may reveal an Ally character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  version: "Steady Strategist",
  willpower: 5,
};
