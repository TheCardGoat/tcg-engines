import type { CharacterCard } from "@tcg/lorcana-types";
import { yzmaTransformedKittenI18n } from "./059-yzma-transformed-kitten.i18n";

export const yzmaTransformedKitten: CharacterCard = {
  id: "uOG",
  canonicalId: "ci_uOG",
  reprints: ["set7-059"],
  cardType: "character",
  name: "Yzma",
  version: "Transformed Kitten",
  inkType: ["amethyst"],
  franchise: "Emperors New Groove",
  set: "007",
  cardNumber: 59,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5a028a55c4554cfd94686805d26929b1",
    tcgPlayer: 619437,
  },
  text: [
    {
      title: "I WIN",
      description:
        "When this character is banished, if you have more cards in your hand than each opponent, you may return this card to your hand.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        type: "optional",
        effect: {
          target: {
            ref: "trigger-source",
          },
          type: "return-to-hand",
        },
      },
      id: "192-1",
      name: "I WIN",
      text: "I WIN When this character is banished, if you have more cards in your hand than each opponent, you may return this card to your hand.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
        condition: {
          type: "comparison",
          left: {
            type: "cards-in-hand",
            controller: "you",
          },
          comparison: "greater-than",
          right: {
            type: "cards-in-hand",
            controller: "opponent",
          },
        },
      },
      type: "triggered",
    },
  ],
  i18n: yzmaTransformedKittenI18n,
};
