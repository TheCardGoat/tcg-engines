import type { CharacterCard } from "@tcg/lorcana-types";
import { pachaTrekmateI18n } from "./102-pacha-trekmate.i18n";

export const pachaTrekmate: CharacterCard = {
  id: "ooN",
  canonicalId: "ci_ooN",
  reprints: ["set7-102"],
  cardType: "character",
  name: "Pacha",
  version: "Trekmate",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "007",
  cardNumber: 102,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b2930c4282b145fe8eabadae2c6567f9",
    tcgPlayer: 619460,
  },
  text: [
    {
      title: "FULL PACK",
      description:
        "While you have more cards in your hand than each opponent, this character gets +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      condition: {
        type: "comparison",
        left: { type: "cards-in-hand", controller: "you" },
        comparison: "greater",
        right: { type: "cards-in-hand", controller: "opponent" },
      },
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "19c-1",
      name: "FULL PACK",
      text: "FULL PACK While you have more cards in your hand than each opponent, this character gets +2 {L}.",
      type: "static",
    },
  ],
  i18n: pachaTrekmateI18n,
};
