import type { CharacterCard } from "@tcg/lorcana-types";

export const gadgetHackwrenchQuirkyScientist: CharacterCard = {
  id: "1xg",
  cardType: "character",
  name: "Gadget Hackwrench",
  version: "Quirky Scientist",
  fullName: "Gadget Hackwrench - Quirky Scientist",
  inkType: ["emerald"],
  franchise: "Rescue Rangers",
  set: "008",
  text: "GOLLY! When you play this character, if an opponent has more cards in their hand than you, you may draw a card.",
  cost: 4,
  strength: 3,
  willpower: 2,
  lore: 2,
  cardNumber: 99,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "fa60b1fa0ad93291d6d2a22286eb5955fb5c309f",
  },
  abilities: [
    {
      id: "1xg-1",
      type: "triggered",
      name: "GOLLY!",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "an opponent has more cards in their hand than you",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
      text: "GOLLY! When you play this character, if an opponent has more cards in their hand than you, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Inventor"],
};
