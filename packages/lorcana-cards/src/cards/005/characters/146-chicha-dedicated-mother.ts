import type { CharacterCard } from "@tcg/lorcana-types";

export const chichaDedicatedMother: CharacterCard = {
  abilities: [
    {
      id: "q5f-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
    {
      effect: {
        condition: {
          expression: "it's the second card you've put into your inkwell this turn",
          type: "if",
        },
        then: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "conditional",
      },
      id: "q5f-2",
      name: "ONE ON THE WAY",
      text: "ONE ON THE WAY During your turn, when you put a card into your inkwell, if it's the second card you've put into your inkwell this turn, you may draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 146,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "5e3fa2a8aeb1d42d259f76ba44d01ee2b3db912c",
  },
  franchise: "Emperors New Groove",
  fullName: "Chicha - Dedicated Mother",
  id: "q5f",
  inkType: ["sapphire"],
  inkable: false,
  lore: 1,
  name: "Chicha",
  set: "005",
  strength: 2,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nONE ON THE WAY During your turn, when you put a card into your inkwell, if it's the second card you've put into your inkwell this turn, you may draw a card.",
  version: "Dedicated Mother",
  willpower: 1,
};
