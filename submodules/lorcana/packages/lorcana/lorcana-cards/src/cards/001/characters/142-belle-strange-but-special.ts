import type { CharacterCard } from "@tcg/lorcana-types";
import { belleStrangeButSpecialI18n } from "./142-belle-strange-but-special.i18n";

export const belleStrangeButSpecial: CharacterCard = {
  id: "6qy",
  canonicalId: "ci_5l8",
  reprints: ["set1-142"],
  cardType: "character",
  name: "Belle",
  version: "Strange but Special",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "001",
  cardNumber: 142,
  rarity: "legendary",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_021c1d57c42d4fb7836097cbe9eacfb7",
    tcgPlayer: 510161,
  },
  text: [
    {
      title: "READ A BOOK",
      description:
        "During your turn, you may put an additional card from your hand into your inkwell facedown.",
    },
    {
      title: "MY FAVORITE PART!",
      description: "While you have 10 or more cards in your inkwell, this character gets +4 {L}.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        amount: 1,
        type: "additional-inkwell",
      },
      id: "uxx-1",
      name: "READ A BOOK",
      text: "**READ A BOOK** During your turn, you may put an additional card from your hand into your inkwell facedown.",
      type: "static",
    },
    {
      effect: {
        condition: {
          type: "inkwell-count",
          comparison: "greater-or-equal",
          controller: "you",
          count: 10,
        },
        then: {
          duration: "while-in-play",
          modifier: 4,
          stat: "lore",
          target: "SELF",
          type: "modify-stat",
        },
        type: "conditional",
      },
      id: "uxx-2",
      name: "MY FAVORITE PART!",
      text: "**MY FAVORITE PART!** While you have 10 or more cards in your inkwell, this character gets +4 {L}.",
      type: "static",
    },
  ],
  i18n: belleStrangeButSpecialI18n,
};
