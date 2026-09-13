import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { fusion } from "../shared/keywords.ts";
import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/emerging-avalanche.generated.ts";

export const emergingAvalanche = definePitchFamily(fabPitchFamilies["emerging-avalanche"], {
  keywords: [fusion("Ice"), goAgain],

  abilities: () => ({
    onEnterArenaCreateTokenFrostbite: {
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
          token: "frostbite",
          controller: "target-controller",
          target: { selector: "any-hero" },
        },
      },
    },
    onActionPhaseStartDestroyModifyNumericPower: {
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
  red: emergingAvalancheRed,
  yellow: emergingAvalancheYellow,
  blue: emergingAvalancheBlue,
} = emergingAvalanche.cards;
