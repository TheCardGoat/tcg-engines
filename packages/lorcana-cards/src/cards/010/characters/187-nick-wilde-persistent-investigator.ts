import type { CharacterCard } from "@tcg/lorcana-types";

export const nickWildePersistentInvestigator: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "17t-1",
      keyword: "Shift",
      text: "Shift 3 {I}",
      type: "keyword",
    },
    {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      id: "17t-2",
      name: "CASE CLOSED",
      text: "CASE CLOSED During your turn, whenever one of your Detective characters banishes another character in a challenge, draw a card.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 187,
  cardType: "character",
  classifications: ["Floodborn", "Ally", "Detective"],
  cost: 5,
  externalIds: {
    ravensburger: "9df2d82945c4e41f639517730cc0186f08e38d71",
  },
  franchise: "Zootropolis",
  fullName: "Nick Wilde - Persistent Investigator",
  id: "17t",
  inkType: ["steel"],
  inkable: false,
  lore: 2,
  name: "Nick Wilde",
  set: "010",
  strength: 5,
  text: "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Nick Wilde.)\nCASE CLOSED During your turn, whenever one of your Detective characters banishes another character in a challenge, draw a card.",
  version: "Persistent Investigator",
  willpower: 4,
};
