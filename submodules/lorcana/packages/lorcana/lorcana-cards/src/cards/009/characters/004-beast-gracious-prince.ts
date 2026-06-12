import type { CharacterCard } from "@tcg/lorcana-types";
import { beastGraciousPrinceI18n } from "./004-beast-gracious-prince.i18n";

export const beastGraciousPrince: CharacterCard = {
  id: "Jpj",
  canonicalId: "ci_TjB",
  reprints: ["set9-004"],
  cardType: "character",
  name: "Beast",
  version: "Gracious Prince",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "009",
  cardNumber: 4,
  rarity: "rare",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8016f590ebb344a2934d76f614fedbba",
    tcgPlayer: 651122,
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
  i18n: beastGraciousPrinceI18n,
};
