import type { LocationCard } from "@tcg/lorcana-types";
import { snugglyDucklingDisreputablePubI18n } from "./135-snuggly-duckling-disreputable-pub.i18n";

export const snugglyDucklingDisreputablePub: LocationCard = {
  id: "dKT",
  canonicalId: "ci_0Wx",
  reprints: ["set4-135"],
  cardType: "location",
  name: "Snuggly Duckling",
  version: "Disreputable Pub",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "004",
  cardNumber: 135,
  rarity: "rare",
  cost: 2,
  willpower: 9,
  moveCost: 2,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_016db7e8b21348aca4b407fb6d2ce26d",
    tcgPlayer: 550838,
  },
  text: [
    {
      title: "ROUTINE RUCKUS",
      description:
        "Whenever a character with 3 {S} or more challenges another character while here, gain 1 lore. If the challenging character has 6 {S} or more, gain 3 lore instead.",
    },
  ],
  abilities: [
    {
      effect: {
        amount: 1,
        selfReplacement: {
          condition: {
            type: "trigger-subject-strength-gte",
            value: 6,
          },
          value: 3,
        },
        type: "gain-lore",
      },
      id: "1o0-1",
      name: "ROUTINE RUCKUS",
      text: "ROUTINE RUCKUS Whenever a character with 3 {S} or more challenges another character while here, gain 1 lore. If the challenging character has 6 {S} or more, gain 3 lore instead.",
      trigger: {
        event: "challenge",
        on: {
          cardType: "character",
          controller: "any",
          filters: [
            {
              type: "strength-comparison",
              comparison: "greater-or-equal",
              value: 3,
            },
            {
              type: "at-location",
              location: "this",
            },
          ],
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: snugglyDucklingDisreputablePubI18n,
};
