import type { ItemCard } from "@tcg/lorcana-types";

export const retrosphere: ItemCard = {
  abilities: [
    {
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
      id: "u85-1",
      text: "EXTRACT OF AMETHYST 2 {I}, Banish this item — Return chosen character, item, or location with cost 3 or less to their player's hand.",
      type: "activated",
    },
  ],
  cardNumber: 64,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "6cf03faac3b20c17430e1e021cb4f2745c895067",
  },
  franchise: "Lorcana",
  id: "u85",
  inkType: ["amethyst"],
  inkable: true,
  missingTests: true,
  name: "Retrosphere",
  set: "005",
  text: "EXTRACT OF AMETHYST 2 {I}, Banish this item — Return chosen character, item, or location with cost 3 or less to their player's hand.",
};
