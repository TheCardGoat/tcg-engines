import type { LocationCard } from "@tcg/lorcana";

export const theLibraryAGiftForBelle: LocationCard = {
  id: "aw2",
  cardType: "location",
  name: "The Library",
  version: "A Gift for Belle",
  fullName: "The Library - A Gift for Belle",
  inkType: ["amethyst"],
  franchise: "Beauty and the Beast",
  set: "005",
  text: "LOST IN A BOOK Whenever a character is banished while here, you may draw a card.",
  cost: 3,
  moveCost: 1,
  lore: 0,
  cardNumber: 68,
  inkable: true,
  externalIds: {
    ravensburger: "2740051e62c6c85db38c623243de3a6437a10a88",
  },
  abilities: [
    {
      id: "aw2-1",
      text: "LOST IN A BOOK Whenever a character is banished while here, you may draw a card.",
      name: "LOST IN A BOOK",
      type: "triggered",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "ANY_CHARACTER",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
};
