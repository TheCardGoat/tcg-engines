import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/two-steps-ahead.generated.ts";

export const twoStepsAhead = definePitchFamily(fabPitchFamilies["two-steps-ahead"], {
  abilities: () => ({
    atStartTurnDestroyCreateConfidenceNumber3MightTokens: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "create-token",
              token: "confidence",
              controller: "controller",
            },
            {
              type: "create-token",
              token: "might",
              controller: "controller",
              count: 3,
            },
          ],
        },
      },
    },
  }),
});

export const { blue: twoStepsAheadBlue } = twoStepsAhead.cards;
