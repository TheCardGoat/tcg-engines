import type { CharacterCard } from "@tcg/lorcana-types";

export const honeyLemonChemicalGenius: CharacterCard = {
  id: "q86",
  cardType: "character",
  name: "Honey Lemon",
  version: "Chemical Genius",
  fullName: "Honey Lemon - Chemical Genius",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "006",
  text: "HERE'S THE BEST PART When you play this character, you may pay 2 {I} to have each opponent choose and discard a card.",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 2,
  cardNumber: 74,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5e86a95c6d5233fcd709d4134f62d1bdc511f8d1",
  },
  abilities: [
    {
      id: "q86-1",
      type: "triggered",
      name: "HERE'S THE BEST PART",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "discard",
          amount: 1,
          target: "EACH_OPPONENT",
          chosen: true,
        },
        chooser: "CONTROLLER",
      },
      text: "HERE'S THE BEST PART When you play this character, you may pay 2 {I} to have each opponent choose and discard a card.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Inventor"],
};
