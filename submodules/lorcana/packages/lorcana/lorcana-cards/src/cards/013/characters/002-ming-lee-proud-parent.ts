import type { CharacterCard } from "@tcg/lorcana-types";
import { mingLeeProudParentI18n } from "./002-ming-lee-proud-parent.i18n";

export const mingLeeProudParent: CharacterCard = {
  id: "QI3",
  canonicalId: "ci_QI3",
  slug: "lorcana-ci_QI3",
  printings: [
    {
      id: "set13-002",
      artId: "set13-002",
      setCode: "set13",
      collectorNumber: "2",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-002"],
  cardType: "character",
  name: "Ming Lee",
  version: "Proud Parent",
  inkType: ["amber"],
  franchise: "Turning Red",
  set: "013",
  cardNumber: 2,
  rarity: "rare",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_4ce702771dcf4edeb10ba61698ecc3a0",
  },
  text: [
    {
      title: "BIGGEST FAN",
      description:
        "If you have a character named Meilin Lee in play, you pay 1 {I} less to play this character.",
    },
    {
      title: "FOLLOW THE MUSIC",
      description: "If you played a song this turn, you pay 1 {I} less to play this character.",
    },
  ],
  classifications: ["Dreamborn", "Mentor", "Red Panda"],
  abilities: [
    {
      type: "static",
      name: "BIGGEST FAN",
      text: "BIGGEST FAN If you have a character named Meilin Lee in play, you pay 1 {I} less to play this character.",
      sourceZones: ["hand"],
      condition: {
        type: "has-named-character",
        controller: "you",
        name: "Meilin Lee",
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
        cardType: "character",
        playMethod: "standard",
      },
    },
    {
      type: "static",
      name: "FOLLOW THE MUSIC",
      text: "FOLLOW THE MUSIC If you played a song this turn, you pay 1 {I} less to play this character.",
      sourceZones: ["hand"],
      condition: {
        type: "turn-metric",
        metric: "played-songs",
        playerScope: "you",
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
        cardType: "character",
        playMethod: "standard",
      },
    },
  ],
  i18n: mingLeeProudParentI18n,
};
