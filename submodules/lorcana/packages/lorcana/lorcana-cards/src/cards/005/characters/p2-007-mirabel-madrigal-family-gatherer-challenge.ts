import type { CharacterCard } from "@tcg/lorcana-types";
import { mirabelMadrigalFamilyGathererP2ChallengeI18n } from "./p2-007-mirabel-madrigal-family-gatherer-challenge.i18n";

export const mirabelMadrigalFamilyGathererP2Challenge: CharacterCard = {
  id: "LAC",
  canonicalId: "ci_t20",
  slug: "lorcana-ci_t20",
  printings: [
    {
      id: "set5-p2-007-challenge",
      artId: "ci_t20-challenge",
      setCode: "set5",
      collectorNumber: "7",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set5-014"],
  cardType: "character",
  name: "Mirabel Madrigal",
  version: "Family Gatherer",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "005",
  cardNumber: 7,
  rarity: "special",
  specialRarity: "challenge",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 5,
  inkable: true,
  externalIds: {
    lorcast: "crd_79ca7c747dcb4e7189ed8bc3a6b14f8b",
    tcgPlayer: "561210",
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
  i18n: mirabelMadrigalFamilyGathererP2ChallengeI18n,
};
