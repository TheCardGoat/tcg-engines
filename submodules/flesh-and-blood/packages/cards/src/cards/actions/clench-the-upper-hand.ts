import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/clench-the-upper-hand.generated.ts";

export const clenchTheUpperHand = definePitchFamily(fabPitchFamilies["clench-the-upper-hand"], {
  abilities: () => ({
    onAttackStatic: {
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
        },
        state: {
          type: "life-comparison",
          player: "self",
          vs: "each-other-hero",
          op: "lt",
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
    onDefendStatic: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
        state: {
          type: "life-comparison",
          player: "self",
          vs: "each-other-hero",
          op: "lt",
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
  }),
});
export const {
  red: clenchTheUpperHandRed,
  yellow: clenchTheUpperHandYellow,
  blue: clenchTheUpperHandBlue,
} = clenchTheUpperHand.cards;
