import type { LocationCard } from "@tcg/lorcana-types";

export const castleOfTheHornedKingBastionOfEvil: LocationCard = {
  id: "lzh",
  cardType: "location",
  name: "Castle of the Horned King",
  version: "Bastion of Evil",
  fullName: "Castle of the Horned King - Bastion of Evil",
  inkType: ["sapphire"],
  franchise: "Black Cauldron",
  set: "010",
  text: "INTO THE GLOOM Once during your turn, whenever a character quests while here, you may ready chosen item.",
  cost: 1,
  moveCost: 1,
  lore: 0,
  cardNumber: 170,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4f3cc788deedfccf111e074d5d5bc60576136b83",
  },
  abilities: [
    {
      id: "lzh-1",
      type: "triggered",
      name: "INTO THE GLOOM Once",
      effect: {
        type: "optional",
        effect: {
          type: "ready",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "INTO THE GLOOM Once during your turn, whenever a character quests while here, you may ready chosen item.",
    },
  ],
};
