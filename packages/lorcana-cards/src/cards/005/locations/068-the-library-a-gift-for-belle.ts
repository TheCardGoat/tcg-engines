import type { LocationCard } from "@tcg/lorcana-types";

export const theLibraryAGiftForBelle: LocationCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      id: "aw2-1",
      name: "LOST IN A BOOK",
      text: "LOST IN A BOOK Whenever a character is banished while here, you may draw a card.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "ANY_CHARACTER",
      },
      type: "triggered",
    },
  ],
  cardNumber: 68,
  cardType: "location",
  cost: 3,
  externalIds: {
    ravensburger: "2740051e62c6c85db38c623243de3a6437a10a88",
  },
  franchise: "Beauty and the Beast",
  fullName: "The Library - A Gift for Belle",
  id: "aw2",
  inkType: ["amethyst"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 1,
  name: "The Library",
  set: "005",
  text: "LOST IN A BOOK Whenever a character is banished while here, you may draw a card.",
  version: "A Gift for Belle",
};
