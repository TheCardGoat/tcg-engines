import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/haunting-specter.generated.ts";
import { ward } from "../shared/keywords.ts";

const abilities = {
  triggeredLeaveArenaSequenceCreateTokenSpectralShieldConditionalZoneCountAddCounterPower: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
      event: {
        name: "leave-arena",
        actor: {
          kind: "any",
        },
        observes: {
          kind: "source",
          selector: "moved-object",
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
            token: "spectral-shield",
            controller: "controller",
          },
          {
            type: "conditional",
            condition: {
              type: "zone-count",
              zone: "permanent",
              player: "controller",
              filter: {
                typeBox: {
                  supertypes: ["Illusionist"],
                  subtypes: ["Aura"],
                },
              },
              comparison: {
                op: "eq",
                value: 1,
              },
            },
            then: {
              type: "add-counter",
              counter: {
                kind: "numeric",
                value: 1,
                property: "power",
              },
              count: 1,
              target: {
                selector: "self",
              },
            },
          },
        ],
      },
    },
  },
} as const;

export const hauntingSpecter = definePitchFamily(fabPitchFamilies["haunting-specter"], {
  keywords: [ward(4)],
  abilities: () => ({ ...abilities }),
});

export const {
  red: hauntingSpecterRed,
  yellow: hauntingSpecterYellow,
  blue: hauntingSpecterBlue,
} = hauntingSpecter.cards;
