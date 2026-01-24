import type { CharacterCard } from "@tcg/lorcana-types";

export const yzmaTransformedKitten: CharacterCard = {
  id: "192",
  cardType: "character",
  name: "Yzma",
  version: "Transformed Kitten",
  fullName: "Yzma - Transformed Kitten",
  inkType: ["amethyst"],
  franchise: "Emperors New Groove",
  set: "007",
  text: "I WIN When this character is banished, if you have more cards in your hand than each opponent, you may return this card to your hand.",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 59,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a338053c5fc78cd2976092628447d8a80725dbad",
  },
  abilities: [
    {
      id: "192-1",
      type: "triggered",
      name: "I WIN",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have more cards in your hand than each opponent",
        },
        then: {
          type: "return-to-hand",
          target: "SELF",
        },
      },
      text: "I WIN When this character is banished, if you have more cards in your hand than each opponent, you may return this card to your hand.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};
