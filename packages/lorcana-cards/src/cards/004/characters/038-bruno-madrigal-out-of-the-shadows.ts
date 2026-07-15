import type { CharacterCard } from "@tcg/lorcana-types";

export const brunoMadrigalOutOfTheShadows: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: "SELF",
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "1qi-1",
      name: "IT WAS YOUR VISION",
      text: "IT WAS YOUR VISION When you play this character, chosen character gains “When this character is banished in a challenge, you may return this card to your hand” this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 38,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Madrigal"],
  cost: 5,
  externalIds: {
    ravensburger: "e14d5d0b9b6bc59f80886c989f265721cdc6c6fc",
  },
  franchise: "Encanto",
  fullName: "Bruno Madrigal - Out of the Shadows",
  id: "1qi",
  inkType: ["amethyst"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Bruno Madrigal",
  set: "004",
  strength: 4,
  text: "IT WAS YOUR VISION When you play this character, chosen character gains “When this character is banished in a challenge, you may return this card to your hand” this turn.",
  version: "Out of the Shadows",
  willpower: 5,
};
