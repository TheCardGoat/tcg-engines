import type { ItemCard } from "@tcg/lorcana-types";

export const devilsEyeDiamond: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        condition: {
          expression: "one of your characters was damaged this turn",
          type: "if",
        },
        then: {
          amount: 1,
          type: "gain-lore",
        },
        type: "conditional",
      },
      id: "136-1",
      text: "THE PRICE OF POWER {E} — If one of your characters was damaged this turn, gain 1 lore.",
      type: "activated",
    },
  ],
  cardNumber: 152,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "8ed363fa97089bc85eafbc80376a5c151fe5edd0",
  },
  franchise: "Rescuers",
  id: "136",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Devil's Eye Diamond",
  set: "007",
  text: "THE PRICE OF POWER {E} — If one of your characters was damaged this turn, gain 1 lore.",
};
