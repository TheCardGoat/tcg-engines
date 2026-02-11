import type { ActionCard } from "@tcg/lorcana-types";

export const goodJob: ActionCard = {
  abilities: [
    {
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
      id: "1q8-1",
      text: "Chosen character gets +1 {L} this turn.",
      type: "action",
    },
  ],
  cardNumber: 27,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "e18dacf13ba36a2bb5ba634fdc8789594b85507a",
  },
  franchise: "Zootropolis",
  id: "1q8",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Good Job!",
  set: "006",
  text: "Chosen character gets +1 {L} this turn.",
};
