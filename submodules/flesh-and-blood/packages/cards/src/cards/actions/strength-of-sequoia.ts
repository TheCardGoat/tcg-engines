import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { fusion } from "../shared/keywords.ts";
import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/strength-of-sequoia.generated.ts";

export const strengthOfSequoia = definePitchFamily(fabPitchFamilies["strength-of-sequoia"], {
  keywords: [fusion("Earth"), goAgain],

  abilities: () => ({
    createSeismicSurgeWhenPlacedFaceUp: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "enter-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
        state: {
          type: "has-status",
          status: "fused",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "seismic-surge",
          controller: "controller",
        },
      },
    },
    createSeismicSurgeAtActionPhaseStart: {
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
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 3,
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: nextAttackActionLatch(),
            },
          ],
        },
      },
    },
  }),
});
export const {
  red: strengthOfSequoiaRed,
  yellow: strengthOfSequoiaYellow,
  blue: strengthOfSequoiaBlue,
} = strengthOfSequoia.cards;
