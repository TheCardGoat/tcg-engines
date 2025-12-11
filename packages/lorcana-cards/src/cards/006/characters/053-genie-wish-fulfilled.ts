import type { CharacterCard } from "@tcg/lorcana";

export const genieWishFulfilled: CharacterCard = {
  id: "n6c",
  cardType: "character",
  name: "Genie",
  version: "Wish Fulfilled",
  fullName: "Genie - Wish Fulfilled",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "006",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nWHAT HAPPENS NOW? When you play this character, draw a card.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 53,
  inkable: false,
  externalIds: {
    ravensburger: "53873ab78cd68666de74c7d32546d4290f86353b",
  },
  abilities: [
    {
      id: "n6c-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
    {
      id: "n6c-2",
      text: "WHAT HAPPENS NOW? When you play this character, draw a card.",
      name: "WHAT HAPPENS NOW?",
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
  classifications: ["Storyborn", "Ally"],
};
