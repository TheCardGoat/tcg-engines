import type { LocationCard } from "@tcg/lorcana-types";

export const prideLandsJungleOasis: LocationCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["location"],
            count: 1,
            owner: "any",
            selector: "self",
            zones: ["play"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "5wg-1",
      text: "OUR HUMBLE HOME While you have 3 or more characters here, you may banish this location to play a character from your discard for free.",
      type: "action",
    },
  ],
  cardNumber: 34,
  cardType: "location",
  cost: 3,
  externalIds: {
    ravensburger: "154540891abf203a5959b722088b9cd9d1ee9109",
  },
  franchise: "Lion King",
  fullName: "Pride Lands - Jungle Oasis",
  id: "5wg",
  inkType: ["amber"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 2,
  name: "Pride Lands",
  set: "005",
  text: "OUR HUMBLE HOME While you have 3 or more characters here, you may banish this location to play a character from your discard for free.",
  version: "Jungle Oasis",
};
