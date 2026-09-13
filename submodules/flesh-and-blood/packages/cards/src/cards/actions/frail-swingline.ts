import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/frail-swingline.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const frailSwingline = definePitchFamily(fabPitchFamilies["frail-swingline"], {
  keywords: [goAgain],
  abilities: () => ({
    createFrailtyTokenUnderTargetHeroSControl: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "frailty",
        controller: "target-controller",
        target: { selector: "any-hero" },
      },
    },
    whenDefendsAttackLessThanBaseControllerDiscards: {
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
            selector: "defended-attack",
            relationship: {
              kind: "any",
            },
            filter: {
              hasStatus: "power-less-than-base",
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
          type: "discard",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "target-controller",
            zones: ["hand"],
            count: 1,
          },
        },
      },
    },
  }),
});
export const { blue: frailSwinglineBlue } = frailSwingline.cards;
