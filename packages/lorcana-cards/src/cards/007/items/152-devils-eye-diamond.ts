import type { ItemCard } from "@tcg/lorcana-types";

export const devilsEyeDiamond: ItemCard = {
  id: "136",
  cardType: "item",
  name: "Devil's Eye Diamond",
  inkType: ["ruby"],
  franchise: "Rescuers",
  set: "007",
  text: "THE PRICE OF POWER {E} — If one of your characters was damaged this turn, gain 1 lore.",
  cost: 2,
  cardNumber: 152,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8ed363fa97089bc85eafbc80376a5c151fe5edd0",
  },
  abilities: [
    {
      id: "136-1",
      type: "activated",
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
      text: "THE PRICE OF POWER {E} — If one of your characters was damaged this turn, gain 1 lore.",
    },
  ],
};
