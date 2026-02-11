import type { LocationCard } from "@tcg/lorcana-types";

export const castleOfTheHornedKingBastionOfEvil: LocationCard = {
  abilities: [
    {
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
      id: "lzh-1",
      name: "INTO THE GLOOM Once",
      text: "INTO THE GLOOM Once during your turn, whenever a character quests while here, you may ready chosen item.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 170,
  cardType: "location",
  cost: 1,
  externalIds: {
    ravensburger: "4f3cc788deedfccf111e074d5d5bc60576136b83",
  },
  franchise: "Black Cauldron",
  fullName: "Castle of the Horned King - Bastion of Evil",
  id: "lzh",
  inkType: ["sapphire"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 1,
  name: "Castle of the Horned King",
  set: "010",
  text: "INTO THE GLOOM Once during your turn, whenever a character quests while here, you may ready chosen item.",
  version: "Bastion of Evil",
};
