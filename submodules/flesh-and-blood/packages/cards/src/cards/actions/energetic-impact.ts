import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/energetic-impact.generated.ts";

export const energeticImpact = definePitchFamily(fabPitchFamilies["energetic-impact"], {
  abilities: () => ({
    whenDefendsTogether6MoreCreateVigorToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
          cohort: {
            kind: "together-with",
            filter: {
              power: {
                op: "gte",
                value: 6,
              },
            },
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
export const { blue: energeticImpactBlue } = energeticImpact.cards;
