import type { CharacterCard } from "@tcg/lorcana-types";
import { pleakleyArcticNaturalistI18n } from "./018-pleakley-arctic-naturalist.i18n";

export const pleakleyArcticNaturalist: CharacterCard = {
  id: "rDI",
  canonicalId: "ci_rDI",
  reprints: ["set11-018"],
  cardType: "character",
  name: "Pleakley",
  version: "Arctic Naturalist",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 18,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_d2e66bee41214f2f9b1e38f4e1ccdbc3",
    tcgPlayer: 673069,
  },
  text: [
    {
      title: "SIGNS OF LIFE",
      description:
        "When you play this character, if you have another Alien character in play, draw a card.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Alien"],
  abilities: [
    {
      id: "6qd-1",
      condition: {
        type: "has-character-count",
        controller: "you",
        classification: "Alien",
        count: 2,
        comparison: "greater-or-equal",
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      name: "SIGNS OF LIFE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "SIGNS OF LIFE When you play this character, if you have another Alien character in play, draw a card.",
    },
  ],
  i18n: pleakleyArcticNaturalistI18n,
};
