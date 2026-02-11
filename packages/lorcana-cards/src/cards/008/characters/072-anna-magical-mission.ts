import type { CharacterCard } from "@tcg/lorcana-types";

export const annaMagicalMission: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "1w2-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
    {
      id: "1w2-2",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
    {
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a character named Elsa in play",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
      id: "1w2-3",
      name: "COORDINATED PLAN",
      text: "COORDINATED PLAN Whenever this character quests, if you have a character named Elsa in play, you may draw a card.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 72,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Queen", "Sorcerer"],
  cost: 6,
  externalIds: {
    ravensburger: "f7597462c9c984bf95b7fa001b581e598fd47c38",
  },
  franchise: "Frozen",
  fullName: "Anna - Magical Mission",
  id: "1w2",
  inkType: ["amethyst", "sapphire"],
  inkable: true,
  lore: 2,
  name: "Anna",
  set: "008",
  strength: 3,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Anna.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)\nCOORDINATED PLAN Whenever this character quests, if you have a character named Elsa in play, you may draw a card.",
  version: "Magical Mission",
  willpower: 6,
};
