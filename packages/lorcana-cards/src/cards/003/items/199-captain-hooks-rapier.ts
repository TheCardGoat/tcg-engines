import type { ItemCard } from "@tcg/lorcana-types";

export const captainHooksRapier: ItemCard = {
  id: "1wl",
  cardType: "item",
  name: "Captain Hook's Rapier",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "003",
  text: "GET THOSE SCURVY BRATS! During your turn, whenever one of your characters banishes another character in a challenge, you may pay 1 {I} to draw a card.\nLET'S HAVE AT IT! Your characters named Captain Hook gain Challenger +1. (They get +1 {S} while challenging.)",
  cost: 3,
  cardNumber: 199,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "f569e647c2ddc5040c35ccaf20487c31e3b00586",
  },
  abilities: [
    {
      id: "1wl-1",
      type: "triggered",
      name: "GET THOSE SCURVY BRATS!",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
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
      text: "GET THOSE SCURVY BRATS! During your turn, whenever one of your characters banishes another character in a challenge, you may pay 1 {I} to draw a card.",
    },
    {
      id: "1wl-2",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: "YOUR_CHARACTERS",
        value: 1,
      },
      text: "LET'S HAVE AT IT! Your characters named Captain Hook gain Challenger +1.",
    },
  ],
};
