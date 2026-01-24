import type { ItemCard } from "@tcg/lorcana-types";

export const thePlank: ItemCard = {
  id: "1yt",
  cardType: "item",
  name: "The Plank",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "004",
  text: "WALK! 2 {I}, Banish this item – Choose one:\n• Banish chosen Hero character.\n• Ready chosen Villain character. They can't quest for the rest of this turn.",
  cost: 3,
  cardNumber: 133,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ff3464c93b7b522cffba8844ab4fd8b78781cec5",
  },
  abilities: [
    {
      id: "1yt-3",
      type: "action",
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
        duration: "this-turn",
      },
      text: "• Ready chosen Villain character. They can't quest for the rest of this turn.",
    },
  ],
};
