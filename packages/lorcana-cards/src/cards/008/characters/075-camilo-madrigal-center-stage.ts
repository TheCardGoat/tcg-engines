import type { CharacterCard } from "@tcg/lorcana-types";

export const camiloMadrigalCenterStage: CharacterCard = {
  id: "p4d",
  cardType: "character",
  name: "Camilo Madrigal",
  version: "Center Stage",
  fullName: "Camilo Madrigal - Center Stage",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "008",
  text: "ENCORE! ENCORE! When this character is banished in a challenge, return this card to your hand.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 75,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5a8a5dd382df9f6c3af7d8d7853cf5237f17914a",
  },
  abilities: [
    {
      id: "p4d-1",
      type: "triggered",
      name: "ENCORE! ENCORE!",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "return-to-hand",
        target: "SELF",
      },
      text: "ENCORE! ENCORE! When this character is banished in a challenge, return this card to your hand.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
};
