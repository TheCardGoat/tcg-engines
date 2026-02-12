import type { CharacterCard } from "@tcg/lorcana-types";

export const theHuntsmanReluctantEnforcer: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          chosen: true,
          target: "CONTROLLER",
          type: "discard",
        },
        type: "optional",
      },
      id: "voc-1",
      name: "CHANGE OF HEART",
      text: "CHANGE OF HEART Whenever this character quests, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 194,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "7229d645f0b5c2c133c5e259e9c46cbb6c82fc78",
  },
  franchise: "Snow White",
  fullName: "The Huntsman - Reluctant Enforcer",
  id: "voc",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "The Huntsman",
  set: "002",
  strength: 1,
  text: "CHANGE OF HEART Whenever this character quests, you may draw a card, then choose and discard a card.",
  version: "Reluctant Enforcer",
  willpower: 1,
};
