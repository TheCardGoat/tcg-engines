import type { CharacterCard } from "@tcg/lorcana-types";

export const julietaMadrigalExcellentCook: CharacterCard = {
  id: "10k",
  cardType: "character",
  name: "Julieta Madrigal",
  version: "Excellent Cook",
  fullName: "Julieta Madrigal - Excellent Cook",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "009",
  text: "SIGNATURE RECIPE When you play this character, you may remove up to 2 damage from chosen character. If you removed damage this way, you may draw a card.",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 18,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "83c1850fb595a638632eaf8ed7f131f16558051a",
  },
  abilities: [
    {
      id: "10k-1",
      type: "triggered",
      name: "SIGNATURE RECIPE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you removed damage this way",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
      text: "SIGNATURE RECIPE When you play this character, you may remove up to 2 damage from chosen character. If you removed damage this way, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Madrigal"],
};
