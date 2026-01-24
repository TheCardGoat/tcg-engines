import type { CharacterCard } from "@tcg/lorcana-types";

export const theHuntsmanReluctantEnforcer: CharacterCard = {
  id: "voc",
  cardType: "character",
  name: "The Huntsman",
  version: "Reluctant Enforcer",
  fullName: "The Huntsman - Reluctant Enforcer",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "002",
  text: "CHANGE OF HEART Whenever this character quests, you may draw a card, then choose and discard a card.",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 2,
  cardNumber: 194,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7229d645f0b5c2c133c5e259e9c46cbb6c82fc78",
  },
  abilities: [
    {
      id: "voc-1",
      type: "triggered",
      name: "CHANGE OF HEART",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "discard",
          amount: 1,
          target: "CONTROLLER",
          chosen: true,
        },
        chooser: "CONTROLLER",
      },
      text: "CHANGE OF HEART Whenever this character quests, you may draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
