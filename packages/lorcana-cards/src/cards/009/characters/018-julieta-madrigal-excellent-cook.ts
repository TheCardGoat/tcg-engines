import type { CharacterCard } from "@tcg/lorcana-types";

export const julietaMadrigalExcellentCook: CharacterCard = {
  abilities: [
    {
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
      id: "10k-1",
      name: "SIGNATURE RECIPE",
      text: "SIGNATURE RECIPE When you play this character, you may remove up to 2 damage from chosen character. If you removed damage this way, you may draw a card.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 18,
  cardType: "character",
  classifications: ["Storyborn", "Mentor", "Madrigal"],
  cost: 3,
  externalIds: {
    ravensburger: "83c1850fb595a638632eaf8ed7f131f16558051a",
  },
  franchise: "Encanto",
  fullName: "Julieta Madrigal - Excellent Cook",
  id: "10k",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Julieta Madrigal",
  set: "009",
  strength: 1,
  text: "SIGNATURE RECIPE When you play this character, you may remove up to 2 damage from chosen character. If you removed damage this way, you may draw a card.",
  version: "Excellent Cook",
  willpower: 4,
};
