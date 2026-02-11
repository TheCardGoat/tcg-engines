import type { ItemCard } from "@tcg/lorcana-types";

export const thePlank: ItemCard = {
  abilities: [
    {
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
        duration: "this-turn",
      },
      id: "1yt-3",
      text: "• Ready chosen Villain character. They can't quest for the rest of this turn.",
      type: "action",
    },
  ],
  cardNumber: 133,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "ff3464c93b7b522cffba8844ab4fd8b78781cec5",
  },
  franchise: "Peter Pan",
  id: "1yt",
  inkType: ["ruby"],
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  name: "The Plank",
  set: "004",
  text: "WALK! 2 {I}, Banish this item – Choose one:\n• Banish chosen Hero character.\n• Ready chosen Villain character. They can't quest for the rest of this turn.",
};
