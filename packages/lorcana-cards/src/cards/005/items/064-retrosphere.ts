import type { ItemCard } from "@tcg/lorcana-types";

export const retrosphere: ItemCard = {
  id: "u85",
  cardType: "item",
  name: "Retrosphere",
  inkType: ["amethyst"],
  franchise: "Lorcana",
  set: "005",
  text: "EXTRACT OF AMETHYST 2 {I}, Banish this item — Return chosen character, item, or location with cost 3 or less to their player's hand.",
  cost: 1,
  cardNumber: 64,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6cf03faac3b20c17430e1e021cb4f2745c895067",
  },
  abilities: [
    {
      id: "u85-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "EXTRACT OF AMETHYST 2 {I}, Banish this item — Return chosen character, item, or location with cost 3 or less to their player's hand.",
    },
  ],
};
