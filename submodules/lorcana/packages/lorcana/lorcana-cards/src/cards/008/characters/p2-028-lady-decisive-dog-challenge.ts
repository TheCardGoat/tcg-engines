import type { CharacterCard } from "@tcg/lorcana-types";
import { ladyDecisiveDogP2ChallengeI18n } from "./p2-028-lady-decisive-dog-challenge.i18n";

export const ladyDecisiveDogP2Challenge: CharacterCard = {
  id: "qcZ",
  canonicalId: "ci_4V7",
  slug: "lorcana-ci_4V7",
  printings: [
    {
      id: "set8-p2-028-challenge",
      artId: "ci_4V7-challenge",
      setCode: "set8",
      collectorNumber: "28",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set8-033"],
  cardType: "character",
  name: "Lady",
  version: "Decisive Dog",
  inkType: ["amber", "emerald"],
  franchise: "Lady and the Tramp",
  set: "008",
  cardNumber: 28,
  rarity: "special",
  specialRarity: "challenge",
  cost: 1,
  strength: 0,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_d5c56759b4164f8d98eac7c93c8514b2",
    tcgPlayer: "633053",
  },
  text: [
    {
      title: "PACK OF HER OWN",
      description: "Whenever you play a character, this character gets +1 {S} this turn.",
    },
    {
      title: "TAKE THE LEAD",
      description: "While this character has 3 {S} or more, she gets +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "4k5-1",
      name: "PACK OF HER OWN",
      text: "PACK OF HER OWN Whenever you play a character, this character gets +1 {S} this turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      condition: {
        type: "stat-threshold",
        stat: "strength",
        value: 3,
        comparison: "greater-or-equal",
        target: "SELF",
      },
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "4k5-2",
      name: "TAKE THE LEAD",
      text: "TAKE THE LEAD While this character has 3 {S} or more, she gets +2 {L}.",
      type: "static",
    },
  ],
  i18n: ladyDecisiveDogP2ChallengeI18n,
};
