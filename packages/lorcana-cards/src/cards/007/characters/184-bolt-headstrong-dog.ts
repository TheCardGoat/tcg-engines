import type { CharacterCard } from "@tcg/lorcana-types";

export const boltHeadstrongDog: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression: "he has no damage",
        },
        then: {
          type: "discard",
          amount: 1,
          target: "CONTROLLER",
          chosen: true,
        },
        type: "conditional",
      },
      id: "131-1",
      name: "THERE'S NO TURNING BACK",
      text: "THERE'S NO TURNING BACK Whenever this character quests, if he has no damage, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 184,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 2,
  externalIds: {
    ravensburger: "8e6b0a691fd08092d8dcbaaa348d77b450f4795e",
  },
  franchise: "Bolt",
  fullName: "Bolt - Headstrong Dog",
  id: "131",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Bolt",
  set: "007",
  strength: 1,
  text: "THERE'S NO TURNING BACK Whenever this character quests, if he has no damage, you may draw a card, then choose and discard a card.",
  version: "Headstrong Dog",
  willpower: 3,
};
