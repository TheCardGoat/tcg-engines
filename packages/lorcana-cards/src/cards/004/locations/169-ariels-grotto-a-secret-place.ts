import type { LocationCard } from "@tcg/lorcana-types";

export const arielsGrottoASecretPlace: LocationCard = {
  id: "1ca",
  cardType: "location",
  name: "Ariel’s Grotto",
  version: "A Secret Place",
  fullName: "Ariel’s Grotto - A Secret Place",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "004",
  text: "TREASURE TROVE While you have 3 or more items in play, this location gets +2 {L}.",
  cost: 2,
  moveCost: 2,
  lore: 0,
  cardNumber: 169,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ade3b9a1cc4c9a87627a75f1318e62b804de153e",
  },
  abilities: [
    {
      id: "1ca-1",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "CHOSEN_CHARACTER",
      },
      text: "TREASURE TROVE While you have 3 or more items in play, this location gets +2 {L}.",
    },
  ],
};
