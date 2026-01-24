import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineInspiredResearcher: CharacterCard = {
  id: "4mp",
  cardType: "character",
  name: "Jasmine",
  version: "Inspired Researcher",
  fullName: "Jasmine - Inspired Researcher",
  inkType: ["sapphire", "steel"],
  franchise: "Aladdin",
  set: "007",
  text: "EXTRA ASSISTANCE Whenever this character quests, if you have no cards in your hand, draw a card for each Ally character you have in play.",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 173,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "10b04e532f811271010fabf5d712bcce0f547d7a",
  },
  abilities: [
    {
      id: "4mp-1",
      type: "triggered",
      name: "EXTRA ASSISTANCE",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have no cards in your hand",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
      text: "EXTRA ASSISTANCE Whenever this character quests, if you have no cards in your hand, draw a card for each Ally character you have in play.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
