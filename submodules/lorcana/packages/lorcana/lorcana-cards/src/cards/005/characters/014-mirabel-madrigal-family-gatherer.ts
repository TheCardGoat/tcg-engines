import type { CharacterCard } from "@tcg/lorcana-types";
import { mirabelMadrigalFamilyGathererI18n } from "./014-mirabel-madrigal-family-gatherer.i18n";

export const mirabelMadrigalFamilyGatherer: CharacterCard = {
  id: "284",
  canonicalId: "ci_284",
  reprints: ["set5-014"],
  cardType: "character",
  name: "Mirabel Madrigal",
  version: "Family Gatherer",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "005",
  cardNumber: 14,
  rarity: "legendary",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 5,
  inkable: true,
  externalIds: {
    lorcast: "crd_79ca7c747dcb4e7189ed8bc3a6b14f8b",
    tcgPlayer: 561210,
  },
  text: [
    {
      title: "NOT WITHOUT MY FAMILY",
      description: "You can't play this character unless you have 5 or more characters in play.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Madrigal"],
  abilities: [
    {
      effect: {
        type: "self-play-condition",
      },
      condition: {
        type: "resource-count",
        what: "characters",
        controller: "you",
        comparison: "greater-or-equal",
        value: 5,
      },
      sourceZones: ["hand"],
      id: "1v7-1",
      name: "NOT WITHOUT MY FAMILY",
      text: "NOT WITHOUT MY FAMILY You can't play this character unless you have 5 or more characters in play.",
      type: "static",
    },
  ],
  i18n: mirabelMadrigalFamilyGathererI18n,
};
