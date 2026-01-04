import type { CharacterCard } from "@tcg/lorcana-types";

export const chichaDedicatedMother: CharacterCard = {
  id: "q5f",
  cardType: "character",
  name: "Chicha",
  version: "Dedicated Mother",
  fullName: "Chicha - Dedicated Mother",
  inkType: ["sapphire"],
  franchise: "Emperors New Groove",
  set: "005",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nONE ON THE WAY During your turn, when you put a card into your inkwell, if it's the second card you've put into your inkwell this turn, you may draw a card.",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 146,
  inkable: false,
  externalIds: {
    ravensburger: "5e3fa2a8aeb1d42d259f76ba44d01ee2b3db912c",
  },
  abilities: [
    {
      id: "q5f-1",
      type: "keyword",
      keyword: "Support",
    },
    {
      id: "q5f-2",
      name: "ONE ON THE WAY",
      type: "triggered",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression:
            "it's the second card you've put into your inkwell this turn",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
