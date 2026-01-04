import type { CharacterCard } from "@tcg/lorcana-types";

export const nickWildePersistentInvestigator: CharacterCard = {
  id: "17t",
  cardType: "character",
  name: "Nick Wilde",
  version: "Persistent Investigator",
  fullName: "Nick Wilde - Persistent Investigator",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "010",
  text: "Shift 3 {I} (You may pay 3 {I} to play this on top of one of your characters named Nick Wilde.)\nCASE CLOSED During your turn, whenever one of your Detective characters banishes another character in a challenge, draw a card.",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 2,
  cardNumber: 187,
  inkable: false,
  externalIds: {
    ravensburger: "9df2d82945c4e41f639517730cc0186f08e38d71",
  },
  abilities: [
    {
      id: "17t-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
    },
    {
      id: "17t-2",
      name: "CASE CLOSED",
      type: "triggered",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  classifications: ["Floodborn", "Ally", "Detective"],
};
