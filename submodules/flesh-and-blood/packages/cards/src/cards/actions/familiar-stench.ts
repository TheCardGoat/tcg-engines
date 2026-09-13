import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/familiar-stench.generated.ts";

export const familiarStench = definePitchFamily(fabPitchFamilies["familiar-stench"], {
  abilities: () => ({
    when1MoreBruteDefendCreateVigorToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "defender",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                supertypes: ["Brute"],
              },
            },
          },
          target: {
            kind: "any",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "vigor",
          controller: "controller",
        },
      },
    },
  }),
});
export const { red: familiarStenchRed } = familiarStench.cards;
