import type { CharacterCard } from "@tcg/lorcana";

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
  externalIds: {
    ravensburger: "83c1850fb595a638632eaf8ed7f131f16558051a",
  },
  abilities: [
    {
      id: "10k-1",
      text: "SIGNATURE RECIPE When you play this character, you may remove up to 2 damage from chosen character. If you removed damage this way, you may draw a card.",
      name: "SIGNATURE RECIPE",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Mentor", "Madrigal"],
};
