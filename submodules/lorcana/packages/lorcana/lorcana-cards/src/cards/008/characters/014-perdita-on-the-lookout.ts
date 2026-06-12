import type { CharacterCard } from "@tcg/lorcana-types";
import { perditaOnTheLookoutI18n } from "./014-perdita-on-the-lookout.i18n";

export const perditaOnTheLookout: CharacterCard = {
  id: "MrJ",
  canonicalId: "ci_MrJ",
  reprints: ["set8-014"],
  cardType: "character",
  name: "Perdita",
  version: "On the Lookout",
  inkType: ["amber"],
  franchise: "101 Dalmatians",
  set: "008",
  cardNumber: 14,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c033341068524d02a75e3ff4d9c9f3e8",
    tcgPlayer: 631358,
  },
  text: [
    {
      title: "KEEPING WATCH",
      description: "While you have a Puppy character in play, this character gets +1 {W}.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Puppy",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        modifier: 1,
        stat: "willpower",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1uw-1",
      name: "KEEPING WATCH",
      text: "KEEPING WATCH While you have a Puppy character in play, this character gets +1 {W}.",
      type: "static",
    },
  ],
  i18n: perditaOnTheLookoutI18n,
};
