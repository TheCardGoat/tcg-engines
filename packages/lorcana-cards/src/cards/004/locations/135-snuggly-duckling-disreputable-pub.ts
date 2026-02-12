import type { LocationCard } from "@tcg/lorcana-types";

export const snugglyDucklingDisreputablePub: LocationCard = {
  abilities: [
    {
      effect: {
        optionLabels: [
          "gain 1 lore. If the challenging character has 6 {S}",
          "more, gain 3 lore instead.",
        ],
        options: [
          {
            amount: 1,
            type: "gain-lore",
          },
          {
            amount: 3,
            type: "gain-lore",
          },
        ],
        type: "choice",
      },
      id: "1o0-1",
      name: "ROUTINE RUCKUS",
      text: "ROUTINE RUCKUS Whenever a character with 3 {S} or more challenges another character while here, gain 1 lore. If the challenging character has 6 {S} or more, gain 3 lore instead.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 135,
  cardType: "location",
  cost: 2,
  externalIds: {
    ravensburger: "d8442ef512485e4740ec831c0beeb50cf8069b5c",
  },
  franchise: "Tangled",
  fullName: "Snuggly Duckling - Disreputable Pub",
  id: "1o0",
  inkType: ["ruby"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 2,
  name: "Snuggly Duckling",
  set: "004",
  text: "ROUTINE RUCKUS Whenever a character with 3 {S} or more challenges another character while here, gain 1 lore. If the challenging character has 6 {S} or more, gain 3 lore instead.",
  version: "Disreputable Pub",
};
