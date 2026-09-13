import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/coalescence-mirage.generated.ts";

import { phantasm } from "../shared/keywords.ts";

const abilities = {
  onDestroyMoveCard: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
      event: {
        name: "destroy",
        actor: {
          kind: "any",
        },
        observes: {
          kind: "none",
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "optional",
        effect: {
          type: "move-card",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["hand"],
            filter: {
              and: [
                {
                  typeBox: {
                    supertypes: ["Illusionist"],
                  },
                },
                {
                  typeBox: {
                    subtypes: ["Aura"],
                  },
                },
              ],
              cost: {
                op: "eq",
                value: 0,
              },
            },
            count: 1,
          },
          to: {
            zone: "permanent",
          },
        },
      },
    },
  },
} as const;

export const coalescenceMirage = definePitchFamily(fabPitchFamilies["coalescence-mirage"], {
  keywords: [phantasm],
  abilities: () => ({ ...abilities }),
});

export const {
  red: coalescenceMirageRed,
  yellow: coalescenceMirageYellow,
  blue: coalescenceMirageBlue,
} = coalescenceMirage.cards;
