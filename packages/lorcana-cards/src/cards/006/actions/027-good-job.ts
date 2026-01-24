import type { ActionCard } from "@tcg/lorcana-types";

export const goodJob: ActionCard = {
  id: "1q8",
  cardType: "action",
  name: "Good Job!",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "006",
  text: "Chosen character gets +1 {L} this turn.",
  cost: 1,
  cardNumber: 27,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e18dacf13ba36a2bb5ba634fdc8789594b85507a",
  },
  abilities: [
    {
      id: "1q8-1",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      text: "Chosen character gets +1 {L} this turn.",
    },
  ],
};
