import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchLittleTricksterI18n } from "./026-stitch-little-trickster.i18n";

export const stitchLittleTrickster: CharacterCard = {
  id: "Yiv",
  canonicalId: "ci_Yiv",
  reprints: ["set6-026"],
  cardType: "character",
  name: "Stitch",
  version: "Little Trickster",
  inkType: ["emerald"],
  franchise: "Lilo and Stitch",
  set: "006",
  cardNumber: 26,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_91292f4ca0684baf9ed9715bf7caa07a",
    tcgPlayer: 592007,
  },
  text: [
    {
      title: "NEED A HAND? 1",
      description: "{I} — This character gets +1 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Alien"],
  abilities: [
    {
      type: "activated",
      name: "NEED A HAND?",
      cost: {
        ink: 1,
      },
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "kka-1",
      text: "NEED A HAND? 1 {I} — This character gets +1 {S} this turn.",
    },
  ],
  i18n: stitchLittleTricksterI18n,
};
