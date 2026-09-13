import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/earth-s-embrace.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const earthSEmbrace = definePitchFamily(fabPitchFamilies["earth-s-embrace"], {
  keywords: [goAgain],
  abilities: () => ({
    atBeginningEndPhaseCreateEmbodimentEarthTokenThen: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "end-phase",
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
              type: "create-token",
              token: "embodiment-of-earth",
              controller: "controller",
            },
            {
              type: "conditional",
              condition: {
                type: "not",
                condition: {
                  type: "performed-this-turn",
                  event: "banish-earth-card",
                  player: "controller",
                },
              },
              then: {
                type: "destroy",
                target: {
                  selector: "self",
                },
              },
            },
          ],
        },
      },
    },
  }),
});
export const { blue: earthSEmbraceBlue } = earthSEmbrace.cards;
