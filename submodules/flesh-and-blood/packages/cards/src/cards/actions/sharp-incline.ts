import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sharp-incline.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const sharpIncline = definePitchFamily(fabPitchFamilies["sharp-incline"], {
  parameters: pitchMap({ red: 1, yellow: 2, blue: 3 }),
  keywords: [
    {
      name: "sharpen",
    },
    goAgain,
  ],
  abilities: (threshold) => ({
    sharpenSword: {
      kind: "resolution",
      effect: {
        type: "sharpen",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "controller",
          zones: ["weapon", "permanent"],
          filter: {
            typeBox: {
              subtypes: ["Sword"],
            },
          },
          count: 1,
        },
        outputBinding: "it",
      },
    },
    reduceNextSwordAttackCost: {
      kind: "resolution",
      condition: {
        type: "has-counter",
        counter: {
          kind: "numeric",
          value: 1,
          property: "power",
        },
        target: {
          selector: "binding",
          binding: "it",
        },
        comparison: {
          op: "gte",
          value: threshold,
        },
      },
      effect: {
        type: "modify-activation-cost",
        op: "subtract",
        amount: 1,
        // "Your next attack with it this turn costs {r} less to activate"
        // latches onto the sharpened sword's own activation; this-attack never
        // resolves from an action-phase card layer. The engine pins an
        // activation-cost applicator to ["activate"], so events stay omitted.
        target: {
          selector: "binding",
          binding: "it",
        },
        duration: "this-turn",
        appliesTo: {
          attacksOf: true,
          count: 1,
          next: {
            typeBox: {
              types: ["Weapon"],
            },
          },
        },
      },
    },
  }),
});

export const {
  red: sharpInclineRed,
  yellow: sharpInclineYellow,
  blue: sharpInclineBlue,
} = sharpIncline.cards;
