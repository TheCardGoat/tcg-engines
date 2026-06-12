import type { CharacterCard } from "@tcg/lorcana-types";
import { tianaCelebratingPrincessI18n } from "./196-tiana-celebrating-princess.i18n";
import { resist } from "../../../helpers/abilities/resist";

export const tianaCelebratingPrincess: CharacterCard = {
  id: "ivr",
  canonicalId: "ci_ivr",
  reprints: ["set2-196"],
  cardType: "character",
  name: "Tiana",
  version: "Celebrating Princess",
  inkType: ["steel"],
  franchise: "Princess and the Frog",
  set: "002",
  cardNumber: 196,
  rarity: "common",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_5879c143b9484d898408440f80e8531e",
    tcgPlayer: 516398,
  },
  text: [
    {
      title: "Resist +2",
    },
    {
      title: "WHAT YOU GIVE IS WHAT YOU GET",
      description:
        "While this character is exerted and you have no cards in your hand, opponents can't play actions.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    resist(2),
    {
      condition: {
        type: "and",
        conditions: [
          {
            type: "exerted",
          },
          {
            type: "resource-count",
            what: "cards-in-hand",
            controller: "you",
            comparison: "equal",
            value: 0,
          },
        ],
      },
      effect: {
        restriction: "cant-play-actions",
        target: "OPPONENTS",
        type: "restriction",
      },
      id: "14e-2",
      name: "WHAT YOU GIVE IS WHAT YOU GET",
      text: "WHAT YOU GIVE IS WHAT YOU GET While this character is exerted and you have no cards in your hand, opponents can't play actions.",
      type: "static",
    },
  ],
  i18n: tianaCelebratingPrincessI18n,
};
