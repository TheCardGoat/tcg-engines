import type { LocationCard } from "@tcg/lorcana-types";

export const arielsGrottoASecretPlace: LocationCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "CHOSEN_CHARACTER",
      },
      id: "1ca-1",
      text: "TREASURE TROVE While you have 3 or more items in play, this location gets +2 {L}.",
      type: "action",
    },
  ],
  cardNumber: 169,
  cardType: "location",
  cost: 2,
  externalIds: {
    ravensburger: "ade3b9a1cc4c9a87627a75f1318e62b804de153e",
  },
  franchise: "Little Mermaid",
  fullName: "Ariel’s Grotto - A Secret Place",
  id: "1ca",
  inkType: ["sapphire"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 2,
  name: "Ariel’s Grotto",
  set: "004",
  text: "TREASURE TROVE While you have 3 or more items in play, this location gets +2 {L}.",
  version: "A Secret Place",
};
