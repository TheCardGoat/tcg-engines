import type { CharacterCard } from "@tcg/lorcana-types";
import { theCoachmanGreedyDeceiverI18n } from "./140-the-coachman-greedy-deceiver.i18n";

export const theCoachmanGreedyDeceiver: CharacterCard = {
  id: "4S2",
  canonicalId: "ci_4S2",
  reprints: ["set8-140"],
  cardType: "character",
  name: "The Coachman",
  version: "Greedy Deceiver",
  inkType: ["ruby", "steel"],
  franchise: "Pinocchio",
  set: "008",
  cardNumber: 140,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_be9dcbe9a9fa41a1986ff7c26818f092",
    tcgPlayer: 631441,
  },
  text: [
    {
      title: "WILD RIDE",
      description:
        "While 2 or more characters of yours are exerted, this character gets +2 {S} and gains Evasive.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      condition: {
        type: "resource-count",
        what: "exerted-characters",
        controller: "you",
        comparison: "greater-or-equal",
        value: 2,
      },
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1ym-1",
      name: "WILD RIDE",
      text: "WILD RIDE While 2 or more characters of yours are exerted, this character gets +2 {S} and gains Evasive.",
      type: "static",
    },
    {
      condition: {
        type: "resource-count",
        what: "exerted-characters",
        controller: "you",
        comparison: "greater-or-equal",
        value: 2,
      },
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "1ym-2",
      name: "WILD RIDE",
      text: "WILD RIDE While 2 or more characters of yours are exerted, this character gets +2 {S} and gains Evasive.",
      type: "static",
    },
  ],
  i18n: theCoachmanGreedyDeceiverI18n,
};
