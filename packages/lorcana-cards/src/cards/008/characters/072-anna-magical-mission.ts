import type { CharacterCard } from "@tcg/lorcana-types";

export const annaMagicalMission: CharacterCard = {
  id: "1w2",
  cardType: "character",
  name: "Anna",
  version: "Magical Mission",
  fullName: "Anna - Magical Mission",
  inkType: ["amethyst", "sapphire"],
  franchise: "Frozen",
  set: "008",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Anna.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)\nCOORDINATED PLAN Whenever this character quests, if you have a character named Elsa in play, you may draw a card.",
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 72,
  inkable: true,
  externalIds: {
    ravensburger: "f7597462c9c984bf95b7fa001b581e598fd47c38",
  },
  abilities: [
    {
      id: "1w2-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
    },
    {
      id: "1w2-2",
      type: "keyword",
      keyword: "Support",
    },
    {
      id: "1w2-3",
      name: "COORDINATED PLAN",
      type: "triggered",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
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
    },
  ],
  classifications: ["Floodborn", "Hero", "Queen", "Sorcerer"],
};
