import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/sigil-of-brilliance.generated.ts";

export const sigilOfBrilliance = definePitchFamily(fabPitchFamilies["sigil-of-brilliance"], {
  keywords: [
    {
      name: "specialization",
      hero: "Oscilio",
    },
  ],
  abilities: () => ({
    atBeginningActionPhaseDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
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
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
    whenLeavesArenaDraw: {
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
          type: "draw",
          count: 1,
          player: "controller",
        },
      },
    },
  }),
});

export const { yellow: sigilOfBrillianceYellow } = sigilOfBrilliance.cards;
