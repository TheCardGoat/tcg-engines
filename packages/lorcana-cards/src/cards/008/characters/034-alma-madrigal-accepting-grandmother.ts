import type { CharacterCard } from "@tcg/lorcana-types";

export const almaMadrigalAcceptingGrandmother: CharacterCard = {
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
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      id: "1sw-1",
      name: "THE MIRACLE IS YOU Once",
      text: "THE MIRACLE IS YOU Once during your turn, whenever one or more of your characters sings a song, you may ready those characters.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 34,
  cardType: "character",
  classifications: ["Storyborn", "Mentor", "Madrigal"],
  cost: 6,
  externalIds: {
    ravensburger: "e9f25b54329962c4e6a6b6b1c3fdd15db57fab7d",
  },
  franchise: "Encanto",
  fullName: "Alma Madrigal - Accepting Grandmother",
  id: "1sw",
  inkType: ["amber", "amethyst"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Alma Madrigal",
  set: "008",
  strength: 5,
  text: "THE MIRACLE IS YOU Once during your turn, whenever one or more of your characters sings a song, you may ready those characters.",
  version: "Accepting Grandmother",
  willpower: 5,
};
