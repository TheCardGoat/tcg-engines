import type { CharacterCard } from "@tcg/lorcana-types";

export const brunoMadrigalOutOfTheShadows: CharacterCard = {
  id: "1qi",
  cardType: "character",
  name: "Bruno Madrigal",
  version: "Out of the Shadows",
  fullName: "Bruno Madrigal - Out of the Shadows",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "004",
  text: "IT WAS YOUR VISION When you play this character, chosen character gains “When this character is banished in a challenge, you may return this card to your hand” this turn.",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  cardNumber: 38,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "e14d5d0b9b6bc59f80886c989f265721cdc6c6fc",
  },
  abilities: [
    {
      id: "1qi-1",
      type: "triggered",
      name: "IT WAS YOUR VISION",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: "SELF",
        },
        chooser: "CONTROLLER",
      },
      text: "IT WAS YOUR VISION When you play this character, chosen character gains “When this character is banished in a challenge, you may return this card to your hand” this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
};
