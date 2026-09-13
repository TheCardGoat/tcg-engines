import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/10-000-year-reunion.generated.ts";

import { ward } from "../shared/keywords.ts";

export const card10000YearReunion = definePitchFamily(fabPitchFamilies["10-000-year-reunion"], {
  keywords: [ward(10)],
  abilities: () => ({
    mayRemoveThree1CountersFromAmongAurasControl: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "alternative-cost",
        cost: {
          class: "effect",
          type: "remove-counters",
          counter: {
            kind: "numeric",
            value: 1,
            property: "power",
          },
          count: 3,
          filter: {
            typeBox: {
              subtypes: ["Aura"],
            },
          },
        },
        optional: true,
      },
    },
  }),
});
export const { red: card10000YearReunionRed } = card10000YearReunion.cards;
