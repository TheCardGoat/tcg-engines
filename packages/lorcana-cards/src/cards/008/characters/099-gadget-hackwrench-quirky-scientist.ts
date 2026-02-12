import type { CharacterCard } from "@tcg/lorcana-types";

export const gadgetHackwrenchQuirkyScientist: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "an opponent has more cards in their hand than you",
          type: "if",
        },
        then: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "conditional",
      },
      id: "1xg-1",
      name: "GOLLY!",
      text: "GOLLY! When you play this character, if an opponent has more cards in their hand than you, you may draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 99,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Inventor"],
  cost: 4,
  externalIds: {
    ravensburger: "fa60b1fa0ad93291d6d2a22286eb5955fb5c309f",
  },
  franchise: "Rescue Rangers",
  fullName: "Gadget Hackwrench - Quirky Scientist",
  id: "1xg",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Gadget Hackwrench",
  set: "008",
  strength: 3,
  text: "GOLLY! When you play this character, if an opponent has more cards in their hand than you, you may draw a card.",
  version: "Quirky Scientist",
  willpower: 2,
};
