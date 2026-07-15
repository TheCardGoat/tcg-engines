import type { CharacterCard } from "@tcg/lorcana-types";
import { beastGraciousPrinceP3PromoI18n } from "./p3-040-beast-gracious-prince-promo.i18n";

export const beastGraciousPrinceP3Promo: CharacterCard = {
  id: "RgE",
  canonicalId: "ci_TjB",
  slug: "lorcana-ci_TjB",
  printings: [
    {
      id: "set9-p3-040-promo",
      artId: "ci_TjB-promo",
      setCode: "set9",
      collectorNumber: "40",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set9-004"],
  cardType: "character",
  name: "Beast",
  version: "Gracious Prince",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "009",
  cardNumber: 40,
  rarity: "special",
  specialRarity: "promo",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8016f590ebb344a2934d76f614fedbba",
    tcgPlayer: "651122",
  },
  text: [
    {
      title: "FULL DANCE CARD",
      description: "Your Princess characters get +1 {S} and +1 {W}.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Princess",
            },
          ],
        },
        type: "modify-stat",
      },
      id: "144-1",
      name: "FULL DANCE CARD",
      text: "FULL DANCE CARD Your Princess characters get +1 {S} and +1 {W}.",
      type: "static",
    },
    {
      effect: {
        modifier: 1,
        stat: "willpower",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Princess",
            },
          ],
        },
        type: "modify-stat",
      },
      id: "144-2",
      name: "FULL DANCE CARD",
      text: "FULL DANCE CARD Your Princess characters get +1 {S} and +1 {W}.",
      type: "static",
    },
  ],
  i18n: beastGraciousPrinceP3PromoI18n,
};
