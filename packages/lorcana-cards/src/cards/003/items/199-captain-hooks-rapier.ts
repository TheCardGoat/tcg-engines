import type { ItemCard } from "@tcg/lorcana-types";

export const captainHooksRapier: ItemCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "1wl-1",
      name: "GET THOSE SCURVY BRATS!",
      text: "GET THOSE SCURVY BRATS! During your turn, whenever one of your characters banishes another character in a challenge, you may pay 1 {I} to draw a card.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      effect: {
        keyword: "Challenger",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
        value: 1,
      },
      id: "1wl-2",
      text: "LET'S HAVE AT IT! Your characters named Captain Hook gain Challenger +1.",
      type: "action",
    },
  ],
  cardNumber: 199,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "f569e647c2ddc5040c35ccaf20487c31e3b00586",
  },
  franchise: "Peter Pan",
  id: "1wl",
  inkType: ["steel"],
  inkable: false,
  missingTests: true,
  name: "Captain Hook's Rapier",
  set: "003",
  text: "GET THOSE SCURVY BRATS! During your turn, whenever one of your characters banishes another character in a challenge, you may pay 1 {I} to draw a card.\nLET'S HAVE AT IT! Your characters named Captain Hook gain Challenger +1. (They get +1 {S} while challenging.)",
};
