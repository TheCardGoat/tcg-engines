import type { ItemCard } from "@tcg/lorcana-types";

export const devilsEyeDiamond: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "one of your characters was damaged this turn",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
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
