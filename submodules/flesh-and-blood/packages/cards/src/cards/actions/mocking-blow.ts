import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mocking-blow.generated.ts";

export const mockingBlow = definePitchFamily(fabPitchFamilies["mocking-blow"], {
  abilities: () => ({
    triggeredAttackLifeComparisonCrowdBoosTheCrowdBoos: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
          },
        },
        state: {
          type: "life-comparison",
          player: "self",
          vs: "opponent",
          op: "gt",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "crowd-boos",
          target: "controller",
        },
      },
      label: {
        name: "the-crowd-boos",
      },
    },
    triggeredCrowdBoosModifyNumericPowerThisTurnTheCrowdBoos: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "crowd-boos",
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
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 4,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
      label: {
        name: "the-crowd-boos",
      },
    },
  }),
});
export const {
  red: mockingBlowRed,
  yellow: mockingBlowYellow,
  blue: mockingBlowBlue,
} = mockingBlow.cards;
