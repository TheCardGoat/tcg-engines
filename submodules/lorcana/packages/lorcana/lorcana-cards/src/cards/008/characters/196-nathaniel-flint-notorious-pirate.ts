import type { CharacterCard } from "@tcg/lorcana-types";
import { nathanielFlintNotoriousPirateI18n } from "./196-nathaniel-flint-notorious-pirate.i18n";

export const nathanielFlintNotoriousPirate: CharacterCard = {
  id: "mAf",
  canonicalId: "ci_mAf",
  reprints: ["set8-196"],
  cardType: "character",
  name: "Nathaniel Flint",
  version: "Notorious Pirate",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "008",
  cardNumber: 196,
  rarity: "rare",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_06dcb232c2b84e47923c74acc1f755aa",
    tcgPlayer: 631836,
  },
  text: [
    {
      title: "PREDATORY INSTINCT",
      description:
        "You can't play this character unless an opposing character took damage this turn.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Alien", "Pirate", "Captain"],
  abilities: [
    {
      effect: {
        type: "self-play-condition",
      },
      condition: {
        type: "turn-metric",
        metric: "damaged-characters-by-owner",
        ownerScope: "opponent",
        comparison: { operator: "gte", value: 1 },
      },
      id: "1ub-1",
      name: "PREDATORY INSTINCT",
      text: "PREDATORY INSTINCT You can't play this character unless an opposing character took damage this turn.",
      type: "static",
    },
  ],
  i18n: nathanielFlintNotoriousPirateI18n,
};
