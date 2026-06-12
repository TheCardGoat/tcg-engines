import type { CharacterCard } from "@tcg/lorcana-types";
import { flynnRiderFrenemyI18n } from "./106-flynn-rider-frenemy.i18n";

export const flynnRiderFrenemy: CharacterCard = {
  id: "CR0",
  canonicalId: "ci_CR0",
  reprints: ["set4-106"],
  cardType: "character",
  name: "Flynn Rider",
  version: "Frenemy",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "004",
  cardNumber: 106,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7cdbe543d7e447a6a84144d85870b3b9",
    tcgPlayer: 550591,
  },
  text: [
    {
      title: "NARROW ADVANTAGE",
      description:
        "At the start of your turn, if you have a character in play with more {S} than each opposing character, gain 3 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [
    {
      id: "2t5-1",
      name: "NARROW ADVANTAGE",
      type: "triggered",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "target-aggregate-comparison",
        left: {
          query: {
            selector: "all",
            owner: "you",
            zones: ["play"],
            cardType: "character",
            filters: [],
          },
          attribute: "strength",
          aggregate: "max",
        },
        right: {
          query: {
            selector: "all",
            owner: "opponent",
            zones: ["play"],
            cardType: "character",
            filters: [],
          },
          attribute: "strength",
          aggregate: "max",
        },
        comparison: "gt",
        requireLeftNonEmpty: true,
        ifRightEmpty: "pass",
      },
      effect: {
        amount: 3,
        type: "gain-lore",
      },
      text: "NARROW ADVANTAGE At the start of your turn, if you have a character in play with more {S} than each opposing character, gain 3 lore.",
    },
  ],
  i18n: flynnRiderFrenemyI18n,
};
