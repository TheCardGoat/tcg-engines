import type { CharacterCard } from "@tcg/lorcana-types";

export const camiloMadrigalCenterStage: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "return-to-hand",
        target: "SELF",
      },
      id: "p4d-1",
      name: "ENCORE! ENCORE!",
      text: "ENCORE! ENCORE! When this character is banished in a challenge, return this card to your hand.",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 75,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Madrigal"],
  cost: 5,
  externalIds: {
    ravensburger: "5a8a5dd382df9f6c3af7d8d7853cf5237f17914a",
  },
  franchise: "Encanto",
  fullName: "Camilo Madrigal - Center Stage",
  id: "p4d",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Camilo Madrigal",
  set: "008",
  strength: 4,
  text: "ENCORE! ENCORE! When this character is banished in a challenge, return this card to your hand.",
  version: "Center Stage",
  willpower: 4,
};
