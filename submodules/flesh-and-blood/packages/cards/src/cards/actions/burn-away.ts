import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/burn-away.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const burnAway = definePitchFamily(fabPitchFamilies["burn-away"], {
  keywords: [goAgain],
  abilities: () => ({
    asAdditionalCostPlayBurnAwayMayBanishPhoenix: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "banish",
          from: "graveyard",
          count: 1,
          filter: {
            name: "Phoenix Flame",
          },
        },
        optional: true,
        then: {
          type: "sequence",
          steps: [
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 2,
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
            {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: goAgain,
              },
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
          ],
        },
      },
    },
  }),
});
export const { red: burnAwayRed } = burnAway.cards;
