import type { LocationCard } from "@tcg/lorcana-types";

export const sevenDwarfsMineSecureFortress: LocationCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "135-1",
      text: "MOUNTAIN DEFENSE During your turn, the first time you move a character here, you may deal 1 damage to chosen character. If the moved character is a Knight, deal 2 damage instead.",
      type: "action",
    },
  ],
  cardNumber: 204,
  cardType: "location",
  cost: 2,
  externalIds: {
    ravensburger: "8e1b0a38fb5b409a3bec3019fd820810ef7faf7a",
  },
  franchise: "Snow White",
  fullName: "Seven Dwarfs' Mine - Secure Fortress",
  id: "135",
  inkType: ["steel"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 2,
  name: "Seven Dwarfs' Mine",
  set: "005",
  text: "MOUNTAIN DEFENSE During your turn, the first time you move a character here, you may deal 1 damage to chosen character. If the moved character is a Knight, deal 2 damage instead.",
  version: "Secure Fortress",
};
