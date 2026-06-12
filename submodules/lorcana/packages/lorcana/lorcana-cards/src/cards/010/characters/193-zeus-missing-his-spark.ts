import type { CharacterCard } from "@tcg/lorcana-types";
import { boost } from "../../../helpers/abilities/boost";
import { zeusMissingHisSparkI18n } from "./193-zeus-missing-his-spark.i18n";

export const zeusMissingHisSpark: CharacterCard = {
  id: "s59",
  canonicalId: "ci_s59",
  reprints: ["set10-193"],
  cardType: "character",
  name: "Zeus",
  version: "Missing His Spark",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "010",
  cardNumber: 193,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0e33059eee7d4f39a4082bb9b1211660",
    tcgPlayer: 659387,
  },
  text: [
    {
      title: "Boost 2 {I}",
    },
    {
      title: "I NEED MORE THUNDERBOLTS!",
      description: "While there's a card under this character, he gets +2 {S} and +2 {W}.",
    },
  ],
  classifications: ["Storyborn", "King", "Deity", "Whisper"],
  abilities: [
    boost(2),
    {
      id: "gow-2",
      name: "I NEED MORE THUNDERBOLTS!",
      type: "static",
      condition: {
        type: "has-card-under",
      },
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      text: "I NEED MORE THUNDERBOLTS! While there's a card under this character, he gets +2 {S} and +2 {W}.",
    },
    {
      id: "gow-3",
      name: "I NEED MORE THUNDERBOLTS!",
      type: "static",
      condition: {
        type: "has-card-under",
      },
      effect: {
        modifier: 2,
        stat: "willpower",
        target: "SELF",
        type: "modify-stat",
      },
      text: "I NEED MORE THUNDERBOLTS! While there's a card under this character, he gets +2 {S} and +2 {W}.",
    },
  ],
  i18n: zeusMissingHisSparkI18n,
};
