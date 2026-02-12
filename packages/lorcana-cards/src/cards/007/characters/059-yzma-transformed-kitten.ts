import type { CharacterCard } from "@tcg/lorcana-types";

export const yzmaTransformedKitten: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "you have more cards in your hand than each opponent",
          type: "if",
        },
        then: {
          target: "SELF",
          type: "return-to-hand",
        },
        type: "conditional",
      },
      id: "192-1",
      name: "I WIN",
      text: "I WIN When this character is banished, if you have more cards in your hand than each opponent, you may return this card to your hand.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 59,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  cost: 2,
  externalIds: {
    ravensburger: "a338053c5fc78cd2976092628447d8a80725dbad",
  },
  franchise: "Emperors New Groove",
  fullName: "Yzma - Transformed Kitten",
  id: "192",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Yzma",
  set: "007",
  strength: 2,
  text: "I WIN When this character is banished, if you have more cards in your hand than each opponent, you may return this card to your hand.",
  version: "Transformed Kitten",
  willpower: 1,
};
