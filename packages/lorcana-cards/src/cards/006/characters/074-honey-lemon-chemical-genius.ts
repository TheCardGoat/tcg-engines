import type { CharacterCard } from "@tcg/lorcana-types";

export const honeyLemonChemicalGenius: CharacterCard = {
  abilities: [
    {
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
      id: "q86-1",
      name: "HERE'S THE BEST PART",
      text: "HERE'S THE BEST PART When you play this character, you may pay 2 {I} to have each opponent choose and discard a card.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 74,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Inventor"],
  cost: 2,
  externalIds: {
    ravensburger: "5e86a95c6d5233fcd709d4134f62d1bdc511f8d1",
  },
  franchise: "Big Hero 6",
  fullName: "Honey Lemon - Chemical Genius",
  id: "q86",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Honey Lemon",
  set: "006",
  strength: 1,
  text: "HERE'S THE BEST PART When you play this character, you may pay 2 {I} to have each opponent choose and discard a card.",
  version: "Chemical Genius",
  willpower: 1,
};
