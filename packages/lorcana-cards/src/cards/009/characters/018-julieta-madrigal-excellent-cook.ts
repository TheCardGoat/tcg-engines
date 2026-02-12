import type { CharacterCard } from "@tcg/lorcana-types";

export const julietaMadrigalExcellentCook: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "you removed damage this way",
          type: "if",
        },
        then: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "conditional",
      },
      id: "10k-1",
      name: "SIGNATURE RECIPE",
      text: "SIGNATURE RECIPE When you play this character, you may remove up to 2 damage from chosen character. If you removed damage this way, you may draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
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
