import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sigil-of-cycles.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const sigilOfCycles = definePitchFamily(fabPitchFamilies["sigil-of-cycles"], {
  keywords: [goAgain],
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
    whenLeavesArenaDiscardDraw: {
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
              type: "discard",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "draw",
              count: 1,
              player: "controller",
            },
          ],
        },
      },
    },
  }),
});

export const { blue: sigilOfCyclesBlue } = sigilOfCycles.cards;
