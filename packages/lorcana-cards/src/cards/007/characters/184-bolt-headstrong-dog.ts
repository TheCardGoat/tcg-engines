import type { CharacterCard } from "@tcg/lorcana-types";

export const boltHeadstrongDog: CharacterCard = {
  id: "131",
  cardType: "character",
  name: "Bolt",
  version: "Headstrong Dog",
  fullName: "Bolt - Headstrong Dog",
  inkType: ["steel"],
  franchise: "Bolt",
  set: "007",
  text: "THERE'S NO TURNING BACK Whenever this character quests, if he has no damage, you may draw a card, then choose and discard a card.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 184,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8e6b0a691fd08092d8dcbaaa348d77b450f4795e",
  },
  abilities: [
    {
      id: "131-1",
      type: "triggered",
      name: "THERE'S NO TURNING BACK",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "conditional",
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
      },
      text: "THERE'S NO TURNING BACK Whenever this character quests, if he has no damage, you may draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
