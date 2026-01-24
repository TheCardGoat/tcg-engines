import type { CharacterCard } from "@tcg/lorcana-types";

export const almaMadrigalAcceptingGrandmother: CharacterCard = {
  id: "1sw",
  cardType: "character",
  name: "Alma Madrigal",
  version: "Accepting Grandmother",
  fullName: "Alma Madrigal - Accepting Grandmother",
  inkType: ["amber", "amethyst"],
  franchise: "Encanto",
  set: "008",
  text: "THE MIRACLE IS YOU Once during your turn, whenever one or more of your characters sings a song, you may ready those characters.",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 34,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e9f25b54329962c4e6a6b6b1c3fdd15db57fab7d",
  },
  abilities: [
    {
      id: "1sw-1",
      type: "triggered",
      name: "THE MIRACLE IS YOU Once",
      effect: {
        type: "optional",
        effect: {
          type: "ready",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "THE MIRACLE IS YOU Once during your turn, whenever one or more of your characters sings a song, you may ready those characters.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Madrigal"],
};
