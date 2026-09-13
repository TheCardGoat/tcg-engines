import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/stonewall-confidence.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const stonewallConfidence = definePitchFamily(fabPitchFamilies["stonewall-confidence"], {
  parameters: pitchMap({ red: 4, yellow: 3, blue: 2 }),
  keywords: [goAgain],
  abilities: (amount) => ({
    continuousStaticModifyNumeric: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: amount,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["stack", "combat-chain"],
          filter: {
            cost: {
              op: "gte",
              value: 3,
            },
            defending: true,
          },
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
      },
    },
    triggeredStaticOnActionPhaseStartEffect: {
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
  }),
});

export const {
  red: stonewallConfidenceRed,
  yellow: stonewallConfidenceYellow,
  blue: stonewallConfidenceBlue,
} = stonewallConfidence.cards;
