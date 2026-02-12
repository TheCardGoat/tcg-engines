import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineInspiredResearcher: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression: "you have no cards in your hand",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "conditional",
      },
      id: "4mp-1",
      name: "EXTRA ASSISTANCE",
      text: "EXTRA ASSISTANCE Whenever this character quests, if you have no cards in your hand, draw a card for each Ally character you have in play.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 173,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 5,
  externalIds: {
    ravensburger: "10b04e532f811271010fabf5d712bcce0f547d7a",
  },
  franchise: "Aladdin",
  fullName: "Jasmine - Inspired Researcher",
  id: "4mp",
  inkType: ["sapphire", "steel"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Jasmine",
  set: "007",
  strength: 3,
  text: "EXTRA ASSISTANCE Whenever this character quests, if you have no cards in your hand, draw a card for each Ally character you have in play.",
  version: "Inspired Researcher",
  willpower: 5,
};
